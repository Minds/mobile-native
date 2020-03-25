import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing } from "react-native-reanimated";
import { bInterpolate, loop } from "react-native-redash";

const { Value, useCode, set } = Animated;

export default function(props) {
  const animation = new Value(0);
  useCode(() => {
    set(
      animation,
      loop({
        toValue: 1,
        duration: 1000,
        easing: Easing.in(Easing.ease),
      }),
    );
  }, [animation]);
  const scale = bInterpolate(animation, 1, 1.3);
  const opacity = bInterpolate(animation, 1, 0);
  const pulseMaxSize = Math.round(1.3 * props.size);

  return (
    <View
      style={[
        styles.circleWrapper,
        {
          width: pulseMaxSize,
          height: pulseMaxSize,
          marginLeft: -pulseMaxSize/2,
          marginTop: -pulseMaxSize/2,
        }
      ]}
    >
      <Animated.View
        style={{
          transform: [{scale}],
          backgroundColor: 'red',
          borderRadius: props.size / 2,
          width: props.size,
          height: props.size,
          opacity,
        }}
      />
      </View>
  );
}

const styles = StyleSheet.create({
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // left: width/8,
    // top: height/2,
  },
  circle: {
    borderWidth: 4 * StyleSheet.hairlineWidth,
  },
});