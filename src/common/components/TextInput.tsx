import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import sp from '~/services/serviceProvider';

export default forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      keyboardAppearance={sp.styles.theme === 0 ? 'light' : 'dark'}
    />
  );
});
