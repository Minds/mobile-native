import React from 'react';
import { Keyboard, Pressable } from 'react-native';

const onPress = () => {
  Keyboard.dismiss();
  console.log('dismissed');
};

/**
 * Dismiss keyboard on tap
 */
export default function DismissKeyboard({ children, ...otherProps }) {
  return (
    <Pressable onPress={onPress} {...otherProps}>
      {children}
    </Pressable>
  );
}
