import React from 'react';
import { View } from 'react-native';
import { getSpacingStyles } from '~ui/helpers';
import { useMemoStyle, useStyle, StyleOrCustom } from '~styles/ThemedStyles';

export interface ISpacer {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  horizontal?: string;
  vertical?: string;
  memo?: boolean;
  style?: any;
}

const withSpacer = Component => ({
  top,
  left,
  right,
  bottom,
  horizontal,
  vertical,
  style,
  memo,
  ...more
}: ISpacer) => {
  const styles: StyleOrCustom[] = [];
  const spacing = getSpacingStyles({
    top,
    left,
    right,
    bottom,
    horizontal,
    vertical,
  });

  if (spacing) {
    styles.push(spacing);
  }

  if (style) {
    styles.push(style);
  }

  const styleObject = memo
    ? useMemoStyle(styles, [style])
    : useStyle(...styles);

  return (
    <View style={styleObject}>
      <Component {...more} />
    </View>
  );
};

export default withSpacer;
