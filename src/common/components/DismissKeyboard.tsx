import React from 'react';
import { Keyboard, Pressable } from 'react-native';

const onPress = () => {
  Keyboard.dismiss();
};

/**
 * Dismiss keyboard on tap
 */
export default function DismissKeyboard({ children, ...otherProps }) {
  return (
    <Pressable accessible={false} onPress={onPress} {...otherProps}>
      {children}
    </Pressable>
  );
}
