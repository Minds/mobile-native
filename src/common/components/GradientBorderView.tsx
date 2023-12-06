import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';

type PropsType = {
  borderWidth: number;
  borderRadius?: number;
  colors: LinearGradientProps['colors'];
  start: LinearGradientProps['start'];
  end: LinearGradientProps['end'];
  innerStyle?: ViewProps['style'];
} & ViewProps;

export default function GradientBorderView({
  borderWidth,
  colors,
  children,
  style,
  innerStyle,
  borderRadius = 0,
  start,
  end,
  ...other
}: PropsType) {
  const innerContainerStyle: any = React.useMemo(
    () => [
      innerStyle,
      {
        margin: borderWidth,
        borderRadius: borderRadius - borderWidth,
        flex: 1,
        overflow: 'hidden',
      },
    ],

    [innerStyle, borderWidth, borderRadius],
  );

  const outerStyle: any = React.useMemo(
    () => [
      style,
      {
        borderRadius: borderRadius,
        overflow: 'hidden',
      },
    ],
    [style, borderRadius],
  );

  return (
    <View style={outerStyle}>
      <LinearGradient colors={colors} start={start} end={end}>
        <View style={innerContainerStyle} {...other}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}
