import React, { useState } from 'react';
import { View } from 'react-native';
import { AnimationProp, GetProps, Stack, styled } from '@tamagui/core';

const ProgressFrame = styled(Stack, {
  name: 'Progress',
  overflow: 'hidden',
  height: '$0.75',
  backgroundColor: '$grey-600',
});

type ProgressFrameProps = GetProps<typeof ProgressFrame> & {
  value: number;
  maxValue?: number;
  animation?: AnimationProp | null | undefined;
};

export const Progress = ProgressFrame.extractable(
  React.forwardRef<View, ProgressFrameProps>(
    (
      {
        value,
        maxValue = 100,
        animation = 'bouncy',
        onLayout,
        ...props
      }: ProgressFrameProps,
      forwardedRef,
    ) => {
      const [width, setWidth] = useState(1);

      //TODO: reimplement when tamagui support width animation
      const indicatorWidth = value / maxValue;
      const dx = (width * (1 - indicatorWidth)) / 2;

      return (
        <ProgressFrame
          {...props}
          ref={forwardedRef}
          onLayout={e => {
            setWidth(e.nativeEvent.layout.width);
            onLayout?.(e);
          }}>
          <Stack
            height={props.height || '$0.75'}
            x={-dx}
            scaleX={indicatorWidth}
            animation={animation}
            backgroundColor="$action"
          />
        </ProgressFrame>
      );
    },
  ),
);
