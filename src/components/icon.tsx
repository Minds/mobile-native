import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

const ICON_WIDTH = 20;
const HALLOW_SIZE = 40;

export type IconStyle = StyleProp<ViewStyle> & {
  tintColor?: string;
};

export type IconProps = SvgProps & {
  name?: string;
  pack?: string;
  hollow?: boolean;
  style?: StyleProp<ViewStyle>;
};
export function Icon(props?: IconProps) {
  const {
    color = (props?.style as IconStyle)?.tintColor,
    width,
    hollow = false,
    style: oldStyle,
    ...rest
  } = props || {};
  const style = Object.assign({}, oldStyle, { tintColor: color });
  const renderIcon = useMemo(
    () => (
      <View
        {...{
          width: width ?? hollow ? ICON_WIDTH : HALLOW_SIZE,
          color,
          style,
          ...rest,
        }}
      />
    ),
    [color, hollow, rest, style, width],
  );

  return hollow ? (
    <View
      style={[
        styles.hallow,
        { backgroundColor: `rgba(${colorToRgb(color as string)}, 0.2)` },
      ]}>
      {renderIcon}
    </View>
  ) : (
    renderIcon
  );
}

const styles = StyleSheet.create({
  hallow: {
    alignItems: 'center',
    borderRadius: HALLOW_SIZE / 2,
    height: HALLOW_SIZE,
    justifyContent: 'center',
    width: HALLOW_SIZE,
  },
});

export function colorToRgb(input: string): number[] | null {
  const fromHex = regExptoArray(
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(input),
  );
  if (fromHex) {
    return fromHex;
  }
  const fromCompactHex = regExptoArray(
    /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(input),
  );
  if (fromCompactHex) {
    return fromCompactHex;
  }
  const fromAlphaHex = regExptoArray(
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(input),
  );
  if (fromAlphaHex) {
    return fromAlphaHex;
  }
  const fromRgba = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i.exec(
    input,
  );
  if (fromRgba) {
    return fromRgba.slice(1, 4).map(val => parseInt(val, 10));
  }
  return null;
}

const regExptoArray = (array?: RegExpExecArray | null): number[] | null =>
  array
    ? [
        parseInt(array?.[1], 16),
        parseInt(array?.[2], 16),
        parseInt(array?.[3], 16),
      ]
    : null;
