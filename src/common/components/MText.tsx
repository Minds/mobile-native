import React from 'react';
import { Text, TextProps } from 'react-native';
import { useStyle } from '../../../src/styles/ThemedStyles';

/**
 * Base font with default family and color
 */
const MText = ({
  style,
  ...p
}: TextProps & {
  children:
    | (string | Element)[]
    | string
    | string[]
    | number
    | undefined
    | Element
    | null;
}) => {
  const defaultStyle = useStyle(
    'colorPrimaryText',
    { fontFamily: 'Roboto' },
    style as any,
  );
  return <Text style={defaultStyle} {...p} />;
};

export default MText;
