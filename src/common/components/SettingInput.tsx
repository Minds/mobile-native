//@ts-nocheck
import React, { Props } from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { View } from 'react-native';
import Input from './Input';

type inputType = 'textInput' | 'phoneInput' | 'dateInput';

type PropsType = {
  onError?: Function;
  wrapperBorder: any;
  ref?: any;
  inputType?: inputType;
} & Props;

/**
 * Deprecated!!!
 * Use InputContainer instead
 */
const SettingInput = ({ onError, ref, ...props }: PropsType) => {
  const theme = ThemedStyles.style;

  const wrapperStyle = [
    theme.paddingHorizontal3x,
    theme.paddingTop3x,
    theme.bgSecondaryBackground,
    props.wrapperBorder,
    theme.bcolorPrimaryBorder,
  ];

  const labelStyle = [theme.colorSecondaryText, theme.fontL];

  return (
    <View style={wrapperStyle}>
      <Input
        style={styles.input}
        labelStyle={labelStyle}
        onError={onError ?? (() => {})}
        ref={ref ?? (() => {})}
        {...props}
      />
    </View>
  );
};

const styles = ThemedStyles.create({
  input: ['border0x', 'paddingBottom2x'],
});

export default SettingInput;
