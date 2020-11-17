import React, { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { mix, useTransition } from 'react-native-redash';

const springConfig = { duration: 100, easing: Easing.ease };

export default function PressableScale(props) {
  const [pressed, setPressed] = useState(false);
  // console.log(pressed)
  const { children, onPressIn, onPressOut, style, ...otherProps } = props;
  const transition = useTransition(pressed, springConfig);
  const onPressInCb = useCallback(
    (e) => {
      setPressed(true);
      if (onPressIn) onPressIn(e);
    },
    [onPressIn],
  );

  const onPressOutCb = useCallback(
    (e) => {
      setPressed(false);
      if (onPressOut) onPressOut(e);
    },
    [onPressOut],
  );

  const v = mix(transition, 1, 0.85);

  const scale = {
    transform: [{ scale: v }],
    opacity: v,
  };

  return (
    <Pressable
      onPressIn={onPressInCb}
      onPressOut={onPressOutCb}
      {...otherProps}>
      <Animated.View style={[scale, style]}>{children}</Animated.View>
    </Pressable>
  );
}
