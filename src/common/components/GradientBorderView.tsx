import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';

type PropsType = {
  borderWidth: number;
  colors: LinearGradientProps['colors'];
  start: LinearGradientProps['start'];
  end: LinearGradientProps['end'];
} & ViewProps;

export default function GradientBorderView({
  borderWidth,
  colors,
  children,
  style,
  start,
  end,
  ...other
}: PropsType) {
  const containerStyle = React.useMemo(
    () => [style, { margin: borderWidth }],
    [style, borderWidth],
  );

  return (
    <LinearGradient colors={colors} start={start} end={end}>
      <View style={containerStyle} {...other}>
        {children}
      </View>
    </LinearGradient>
  );
}
