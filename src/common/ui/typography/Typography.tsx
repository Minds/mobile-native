import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { FAMILY } from './constants';

const Typography = ({
  center,
  bold,
  children,
  color,
  defStyle,
  style,
  ...more
}) => {
  const fontStyle = useMemo(() => {
    return [
      defStyle,
      styles.regular,
      center && styles.center,
      bold && styles.bold,
      color && { color },
      style,
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, bold, color, style]);

  return (
    <Text style={fontStyle} {...more}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  bold: {
    fontFamily: FAMILY.bold,
  },
  medium: {
    fontFamily: FAMILY.medium,
  },
  regular: {
    fontFamily: FAMILY.regular,
  },
});

export default Typography;
