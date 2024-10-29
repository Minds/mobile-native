import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import sp from '~/services/serviceProvider';

export type MTextProps = TextProps & {
  children:
    | (string | ReactNode)[]
    | string
    | string[]
    | number
    | undefined
    | ReactNode
    | null;
};

/**
 * Base font with default family and color
 */
const MText = ({ style, ...p }: MTextProps) => {
  const defaultStyle = [
    sp.styles.style.colorPrimaryText,
    styles.text,
    style as any,
  ];

  return <Text style={defaultStyle} {...p} />;
};

const styles = StyleSheet.create({
  text: { fontFamily: 'Roboto_400Regular' },
});

export default MText;
