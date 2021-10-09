import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const SPRING = {
  mass: 1.35,
  damping: 12,
  stiffness: 800,
};

const TIMED = {
  duration: 125,
  easing: Easing.quad,
};

export default function PressableScale(props) {
  const { children, onPressIn, onPressOut, style, ...otherProps } = props;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const onPressInCb = useCallback(
    e => {
      scale.value = withTiming(0.84, TIMED);
      opacity.value = withTiming(0.8, TIMED);

      if (onPressIn) {
        onPressIn(e);
      }
    },
    [onPressIn, scale.value, opacity.value],
  );

  const onPressOutCb = useCallback(
    e => {
      scale.value = withSpring(1, SPRING);
      opacity.value = withTiming(1, TIMED);

      if (onPressOut) {
        onPressOut(e);
      }
    },
    [onPressOut, scale.value, opacity.value],
  );

  return (
    <Pressable
      style={style}
      onPressIn={onPressInCb}
      onPressOut={onPressOutCb}
      {...otherProps}>
      <Animated.View style={animatedStyles}>{children}</Animated.View>
    </Pressable>
  );
}
