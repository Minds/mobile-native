import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';

import { Button, H4, Icon, ScreenSection } from '~/common/ui';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import Header from './Header';

import { useSurveyData } from '../hooks';
import sp from '~/services/serviceProvider';

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
  onPressContinue?: () => void;
};

type SurveyComponentProps = SurveyViewProps & {
  data?: Survey[];
};

const SurveyComponent = ({ onPressContinue, data }: SurveyComponentProps) => {
  const theme = sp.styles.style;
  const [selection, setSelection] = useState<string>();

  const {
    title = '',
    description = '',
    radioSurveyQuestion,
    radioSurvey,
  } = data?.[0] ?? {};

  const onPressNext = useCallback(() => {
    // TODO: do something with the selection
    onPressContinue?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPress = (value?: string) => () => {
    setSelection(value);
  };

  return (
    <>
      <Header {...{ title, description, spaced: true }} />
      <H4 horizontal="XXXL" bottom="L">
        {radioSurveyQuestion}
      </H4>
      <View style={[theme.flexContainer, theme.paddingHorizontal3x]}>
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
              containerItemStyle={theme.marginBottom2x}
            />
          );
        })}
      </View>
      <ScreenSection bottom="L">
        <Button
          type="action"
          size="large"
          disabled={!selection}
          onPress={onPressNext}>
          Continue
        </Button>
      </ScreenSection>
    </>
  );
};

const Check = ({ checked }: { checked?: boolean }) => (
  <View style={checked ? styles.check : styles.checkBlank}>
    {checked && <Icon name="check" color="ButtonText" size="small" />}
  </View>
);

export const SurveyView = observer(({ onPressContinue }: SurveyViewProps) => {
  const { data } = useSurveyData();
  return <SurveyComponent data={data} onPressContinue={onPressContinue} />;
});

const styles = sp.styles.create({
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
