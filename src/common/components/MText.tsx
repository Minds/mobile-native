import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import ThemedStyles from '~styles/ThemedStyles';

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
  const defaultStyle = [
    ThemedStyles.style.colorPrimaryText,
    styles.text,
    style as any,
  ];

  return <Text style={defaultStyle} {...p} />;
};

const styles = StyleSheet.create({
  text: { fontFamily: 'Roboto' },
});

export default MText;
