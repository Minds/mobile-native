import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { B1 } from './Body';
import { UNIT } from '~styles/Tokens';

export const PressableText = ({
  component,
  children,
  onPress,
  ...more
}: any) => {
  const Renderer = component || B1;
  return (
    <TouchableWithoutFeedback
      hitSlop={{ top: UNIT.XS, left: UNIT.XS, right: UNIT.XS, bottom: UNIT.XS }}
      onPress={onPress}>
      <Renderer {...more}>{children}</Renderer>
    </TouchableWithoutFeedback>
  );
};
