import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { getSpacingStylesNext } from '~ui/helpers';
import { SpacerPropType } from './types';

export const Spacer = ({
  top,
  left,
  right,
  bottom,
  horizontal,
  vertical,
  space,
  style,
  children,
}: SpacerPropType) => {
  const styleList: ViewStyle = useMemo(() => {
    const styles: ViewStyle[] | any = [];
    const spacing: ViewStyle = getSpacingStylesNext({
      top,
      left,
      right,
      bottom,
      horizontal,
      vertical,
      space,
    });

    if (spacing) {
      styles.push(spacing);
    }

    if (style) {
      styles.push(style);
    }

    return StyleSheet.flatten(styles);
  }, [top, left, right, bottom, horizontal, vertical, style, space]);

  return <View style={styleList}>{children}</View>;
};

export const withSpacer = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P & SpacerPropType> => ({
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
