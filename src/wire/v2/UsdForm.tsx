import React from 'react';
import { observer } from 'mobx-react';
import { View, ScrollView } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import LabeledComponent from '../../common/components/LabeledComponent';
import { CheckBox } from 'react-native-elements';
import { styles } from './TokensForm';
import InputContainer from '../../common/components/InputContainer';
import MText from '../../common/components/MText';

const UsdForm = observer(() => {
  const theme = ThemedStyles.style;

  return (
    <View>
      <InputContainer
        containerStyle={styles.inputContainer}
        labelStyle={styles.label}
        style={styles.inputText}
        placeholder={'USD'}
        keyboardType="decimal-pad"
        testID="fabTokensInput"
      />
      <View style={theme.paddingHorizontal4x}>
        <ScrollView contentContainerStyle={scrollviewStyle} />
        <LabeledComponent label="Repeat Payment Monthly">
          <CheckBox
            containerStyle={[theme.checkbox, styles.checkbox]}
            title={<MText style={textStyle}>Repeat ?</MText>}
            checked={false}
          />
        </LabeledComponent>
      </View>
    </View>
  );
});

const scrollviewStyle = ThemedStyles.combine('paddingTop2x');

const textStyle = ThemedStyles.combine(
  'colorPrimaryText',
  'fontMedium',
  'paddingLeft',
  'fontL',
);

export default UsdForm;
