import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet, ViewProps } from 'react-native';
import { getSpacingStylesNext } from '~ui/helpers';
import type { SpacerPropType } from './types';

export const Spacer = ({
  top,
  left,
  right,
  bottom,
  horizontal,
  vertical,
  space,
  containerStyle,
  children,
  spacingType,
  ...viewProps
}: SpacerPropType & Omit<ViewProps, 'style'>) => {
  const styleList: ViewStyle = useMemo(() => {
    const styles: ViewStyle[] | any = [];
    const spacing: ViewStyle = getSpacingStylesNext(
      {
        top,
        left,
        right,
        bottom,
        horizontal,
        vertical,
        space,
      },
      spacingType,
    );

    if (spacing) {
      styles.push(spacing);
    }

    if (containerStyle) {
      styles.push(containerStyle);
    }

    return StyleSheet.flatten(styles);
  }, [
    top,
    left,
    right,
    bottom,
    horizontal,
    vertical,
    containerStyle,
    space,
    spacingType,
  ]);

  return (
    <View style={styleList} {...viewProps}>
      {children}
    </View>
  );
};

export const withSpacer = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P & SpacerPropType> => {
  const wrapper: React.FC<P & SpacerPropType> = ({
    top,
    left,
    right,
    bottom,
    horizontal,
    vertical,
    containerStyle = { alignSelf: 'stretch' },
    ...more
  }) => {
    if (top || left || right || bottom || horizontal || vertical) {
      return (
        <Spacer
          top={top}
          left={left}
          right={right}
          bottom={bottom}
          horizontal={horizontal}
          vertical={vertical}
          containerStyle={containerStyle}>
          <Component {...(more as P)} />
        </Spacer>
      );
    } else {
      return <Component {...(more as P)} />;
    }
  };
  wrapper.displayName = `withSpacer(${
    Component.displayName || Component.name
  })`;

  return wrapper;
};
