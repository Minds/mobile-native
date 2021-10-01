import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { View as MotiView, useAnimationState } from 'moti';

export default function PressableScale(props) {
  // console.log(pressed)
  const { children, onPressIn, onPressOut, style, ...otherProps } = props;

  const scaleIn = useAnimationState({
    from: {
      scale: 0.8,
      opacity: 0.7,
    },
    to: {
      scale: 1,
      opacity: 1,
    },
  });

  const onPressInCb = useCallback(
    e => {
      scaleIn.transitionTo('from');
      if (onPressIn) onPressIn(e);
    },
    [onPressIn, scaleIn],
  );

  const onPressOutCb = useCallback(
    e => {
      scaleIn.transitionTo('to');
      if (onPressOut) onPressOut(e);
    },
    [onPressOut, scaleIn],
  );

  return (
    <Pressable
      onPressIn={onPressInCb}
      onPressOut={onPressOutCb}
      {...otherProps}>
      <MotiView
        state={scaleIn}
        style={style}
        transition={{
          type: 'timing',
        }}>
        {children}
      </MotiView>
    </Pressable>
  );
}
