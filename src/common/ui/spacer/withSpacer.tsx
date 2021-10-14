import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { getSpacingStyles } from '~ui/helpers';

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

const withSpacer = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P & ISpacer> => ({
  top,
  left,
  right,
  bottom,
  horizontal,
  vertical,
  style,
  ...more
}) => {
  const styleList: ViewStyle[] = useMemo(() => {
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

    return styles;
  }, [top, left, right, bottom, horizontal, vertical, style]);

  return (
    <View style={styleList}>
      <Component {...(more as P)} />
    </View>
  );
};

export default withSpacer;
