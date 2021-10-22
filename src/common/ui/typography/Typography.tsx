import React, { useMemo } from 'react';
import { Text, TouchableWithoutFeedback } from 'react-native';
import { FONT_FAMILY } from '~styles/Tokens';
import { UNIT } from '~styles/Tokens';
import ThemedStyles from '~styles/ThemedStyles';

export const Typography = ({
  center,
  bold,
  children,
  defStyle,
  link,
  secondary,
  flat,
  style,
  italic,
  white,
  onPress,
  ...more
}: any) => {
  // This could use global memoization
  const fontStyle = useMemo(() => {
    return [
      defStyle,
      styles.primary,
      styles.regular,
      center && styles.center,
      bold && styles.bold,
      italic && styles.italic,
      flat && styles.flat,
      link && styles.link,
      secondary && styles.secondary,
      white && styles.white,
      style,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, bold, style, link, secondary, white]);

  const renderedText = (
    <Text style={fontStyle} {...more}>
      {children}
    </Text>
  );

  if (!onPress) {
    return renderedText;
  }

  return (
    <TouchableWithoutFeedback
      hitSlop={{ top: UNIT.XS, left: UNIT.XS, right: UNIT.XS, bottom: UNIT.XS }}
      onPress={onPress}>
      {renderedText}
    </TouchableWithoutFeedback>
  );
};

const styles = ThemedStyles.create({
  primary: ['colorPrimaryText'],
  white: ['colorWhite'],
  secondary: ['colorSecondaryText'],
  link: ['colorLink'],
  center: {
    textAlign: 'center',
  },
  flat: {
    lineHeight: 0,
  },
  bold: {
    fontFamily: FONT_FAMILY.bold,
  },
  medium: {
    fontFamily: FONT_FAMILY.medium,
  },
  regular: {
    fontFamily: FONT_FAMILY.regular,
  },
  italic: {
    fontFamily: FONT_FAMILY.italic,
  },
});
