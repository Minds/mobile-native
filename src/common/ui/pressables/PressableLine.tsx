import React from 'react';
import { TouchableHighlight } from 'react-native';
import { TRANSPARENCY } from '~/styles/Tokens';

export const PressableLine = props => {
  return (
    <TouchableHighlight underlayColor={TRANSPARENCY.DARKEN10} {...props} />
  );
};
