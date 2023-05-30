import React, { useCallback, useRef } from 'react';
import { Pressable, Animated } from 'react-native';

export default function PressableScale(props) {
  const { children, onPressIn, onPressOut, style, innerStyle, ...otherProps } =
    props;

  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const onPressInCb = useCallback(
    e => {
      Animated.timing(scaleAnimation, {
        toValue: 0.84,
        duration: 125,
        useNativeDriver: true,
      }).start();

      if (onPressIn) {
        onPressIn(e);
      }
    },
    [onPressIn, scaleAnimation],
  );

  const onPressOutCb = useCallback(
    e => {
      Animated.spring(scaleAnimation, {
        toValue: 1,
        mass: 1.3,
        damping: 20,
        stiffness: 800,
        useNativeDriver: true,
      }).start();

      if (onPressOut) {
        onPressOut(e);
      }
    },
    [onPressOut, scaleAnimation],
  );

  return (
    <Pressable
      style={style}
      onPressIn={onPressInCb}
      onPressOut={onPressOutCb}
      {...otherProps}>
      <Animated.View
        style={[{ transform: [{ scale: scaleAnimation }] }, innerStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
