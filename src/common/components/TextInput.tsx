import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

export default forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      keyboardAppearance={ThemedStyles.theme === 0 ? 'light' : 'dark'}
    />
  );
});
