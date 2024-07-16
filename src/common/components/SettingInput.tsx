import React from 'react';
import { View } from 'react-native';

import Input from './Input';
import sp from '~/services/serviceProvider';

type inputType = 'textInput' | 'phoneInput' | 'dateInput';

type PropsType = {
  onError?: Function;
  wrapperBorder: any;
  ref?: any;
  inputType?: inputType;
} & React.ComponentProps<typeof Input>;

/**
 * Deprecated!!!
 * Use InputContainer instead
 */
const SettingInput = ({ ref, ...props }: PropsType) => {
  const theme = sp.styles.style;

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
        ref={ref}
        {...props}
      />
    </View>
  );
};

const styles = sp.styles.create({
  input: ['border0x', 'paddingBottom2x'],
});

export default SettingInput;
