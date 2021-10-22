import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { FONT_FAMILY } from '~styles/Tokens';
import { UNIT } from '~styles/Tokens';
import ThemedStyles from '~/styles/ThemedStyles';

const Typography = ({
  center,
  bold,
  children,
  defStyle,
  link,
  light,
  flat,
  style,
  italic,
  onPress,
  ...more
}: any) => {
  const fontStyle = useMemo(() => {
    return [
      defStyle,
      ThemedStyles.style.colorPrimaryText,
      styles.regular,
      center && styles.center,
      bold && styles.bold,
      italic && styles.italic,
      link && ThemedStyles.style.link,
      light && ThemedStyles.style.colorSecondaryText,
      flat && { lineHeight: 0 },
      style,
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, bold, style, link, light]);

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

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
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

export default Typography;
