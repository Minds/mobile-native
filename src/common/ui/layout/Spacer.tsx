import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { getSpacingStyles } from '~ui/helpers';

export interface ISpacer {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  horizontal?: string;
  vertical?: string;
  style?: any;
  children?: any;
}

const Spacer = ({
  top,
  left,
  right,
  bottom,
  horizontal,
  vertical,
  style,
  children,
}: ISpacer) => {
  const styleList: ViewStyle = useMemo(() => {
    const styles: ViewStyle[] = getSpacingStyles({
      top,
      left,
      right,
      bottom,
      horizontal,
      vertical,
    });

    if (style) {
      styles.push(style);
    }

    return StyleSheet.flatten(styles);
  }, [top, left, right, bottom, horizontal, vertical, style]);

  return <View style={styleList}>{children}</View>;
};

export default Spacer;
