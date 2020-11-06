import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { useLoop } from 'react-native-reanimated-hooks';
import { mix } from 'react-native-redash';

export default function (props) {
  const loop = useLoop({ easing: Easing.in(Easing.ease) });

  const circleStyle = useMemo(() => {
    const scale = mix(loop.position, 1, 1.3);
    const opacity = mix(loop.position, 1, 0);

    return {
      transform: [{ scale }],
      backgroundColor: 'red',
      borderRadius: props.size / 2,
      width: props.size,
      height: props.size,
      opacity,
    };
  }, [loop.position, props.size]);

  const pulseMaxSize = Math.round(1.3 * props.size);

  return (
    <View
      style={[
        styles.circleWrapper,
        {
          width: pulseMaxSize,
          height: pulseMaxSize,
          marginLeft: -pulseMaxSize / 2,
          marginTop: -pulseMaxSize / 2,
        },
      ]}>
      <Animated.View style={circleStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  circle: {
    borderWidth: 4 * StyleSheet.hairlineWidth,
  },
});
