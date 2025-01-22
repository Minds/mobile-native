import React, { FC } from 'react';
import { MotiProps, View as MotiView } from 'moti';
import { ViewProps, ViewStyle } from 'react-native';

const animation = {
  from: {
    scale: 1,
  },

  to: {
    scale: 1.05,
  },
};

/**
 * Fade content from
 */
export const FadeFrom: FC<
  ViewProps &
    MotiProps<ViewStyle> & {
      repeat?: number;
    }
> = ({ children, repeat = 4, ...props }) => {
  const transition = {
    repeat,
    duration: 100,
    delay: 30,
  };

  return (
    <MotiView
      {...(props as any)}
      from={animation.from}
      animate={animation.to}
      transition={transition}>
      {children}
    </MotiView>
  );
};

export default FadeFrom;
