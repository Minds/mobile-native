import React from 'react';
import { Text, TextProps } from 'react-native';
import { useMemoStyle, useStyle } from '../../../src/styles/ThemedStyles';

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

// Temporary DText used on the Button component
export const DText = ({
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
  const defaultStyle = useMemoStyle(
    ['colorPrimaryText', { fontFamily: 'Roboto' }, style as any],
    [style],
  );
  return <Text style={defaultStyle} {...p} />;
};

export default MText;
