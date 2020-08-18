import React from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const onPress = () => Keyboard.dismiss();

/**
 * Dismiss keyboard on tap
 */
export default function DismissKeyboard({ children, ...otherProps }) {
  return (
    <TouchableWithoutFeedback onPress={onPress} {...otherProps}>
      {children}
    </TouchableWithoutFeedback>
  );
}
