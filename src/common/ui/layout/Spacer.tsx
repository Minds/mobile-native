import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { getSpacingStylesNext } from '~ui/helpers';

export interface ISpacer {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  horizontal?: string;
  vertical?: string;
  style?: any;
  children?: React.ReactNode;
}

export const Spacer = ({
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
    const styles: ViewStyle[] = [];
    const spacing: ViewStyle = getSpacingStylesNext({
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

    return StyleSheet.flatten(styles);
  }, [top, left, right, bottom, horizontal, vertical, style]);

  return <View style={styleList}>{children}</View>;
};

export const withSpacer = <P extends object>(
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
  return (
    <Spacer {...{ top, left, right, bottom, horizontal, vertical, style }}>
      <Component {...(more as P)} />
    </Spacer>
  );
};
