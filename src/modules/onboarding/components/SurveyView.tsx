import { useState } from 'react';
import { View } from 'react-native';

import { H4, Icon } from '~/common/ui';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import Header from './Header';
import ThemedStyles from '~/styles/ThemedStyles';
import { useSurveylData } from '../hooks';

type Survey = {
  title: string | undefined;
  description: string | undefined;
  radioSurveyQuestion: string | null | undefined;
  radioSurvey:
    | Array<{
        id: string;
        optionTitle: string;
        optionDescription: string;
        optionKey: string;
      } | null>
    | null
    | undefined;
};

type SurveyViewProps = {
  onSelect?: (selection?: string) => void;
};

type SurveyComponentProps = SurveyViewProps & {
  data?: Survey[];
};

const SurveyComponent = (props: SurveyComponentProps) => {
  const [selection, setSelection] = useState<string>();

  const {
    title = '',
    description = '',
    radioSurveyQuestion,
    radioSurvey,
  } = props.data?.[0] ?? {};

  const onPress = (value?: string) => () => {
    setSelection(value);
    props.onSelect?.(value);
  };

  return (
    <>
      <Header {...{ title, description, spaced: true }} />
      <H4 left="XXXL" bottom="L">
        {radioSurveyQuestion}
      </H4>
      <View style={ThemedStyles.style.paddingHorizontal3x}>
        {radioSurvey?.map(survey => {
          return (
            <MenuItemOption
              key={survey?.id}
              title={survey?.optionTitle}
              subtitle={survey?.optionDescription}
              icon={<Check checked={selection === survey?.optionKey} />}
              onPress={onPress(survey?.optionKey)}
              mode="radio"
              reversedIcon
              multiLine
              borderless
              selected
              containerItemStyle={ThemedStyles.style.marginBottom2x}
            />
          );
        })}
      </View>
    </>
  );
};

const Check = ({ checked }: { checked?: boolean }) => (
  <View style={checked ? styles.check : styles.checkBlank}>
    {checked && <Icon name="check" color="ButtonText" size="small" />}
  </View>
);

export const SurveyView = ({ onSelect }: SurveyViewProps) => {
  const { data } = useSurveylData();
  console.log('SurveyView', JSON.stringify(data));
  return <SurveyComponent data={data} onSelect={onSelect} />;
};

const styles = ThemedStyles.create({
  rounded: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  get check() {
    return [this.rounded, 'bgLink', 'centered', 'marginTop2x'];
  },
  get checkBlank() {
    return [this.rounded, 'border2x', 'bcolorActive', 'marginTop2x'];
  },
});
