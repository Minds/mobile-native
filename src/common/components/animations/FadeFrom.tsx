import React, { FC } from 'react';
import { MotiProps, View as MotiView } from 'moti';
import { ViewProps, ViewStyle } from 'react-native';

type DirectionType = 'bottom' | 'top' | 'left' | 'right';

/**
 * Fade content from
 */
export const FadeFrom: FC<
  ViewProps & MotiProps<ViewStyle> & { direction?: DirectionType }
> = ({ children, direction = 'bottom', ...props }) => {
  const [from, animate] = React.useMemo(() => {
    switch (direction) {
      case 'bottom':
        return [
          { opacity: 0, translateY: 50 },
          { opacity: 1, translateY: 0 },
        ];
      case 'top':
        return [
          { opacity: 0, translateY: -50 },
          { opacity: 1, translateY: 0 },
        ];
      case 'left':
        return [
          { opacity: 0, translateX: -50 },
          { opacity: 1, translateX: 0 },
        ];
      case 'right':
        return [
          { opacity: 0, translateX: 50 },
          { opacity: 1, translateX: 0 },
        ];
    }
  }, [direction]);

  return (
    <MotiView {...(props as any)} from={from} animate={animate}>
      {children}
    </MotiView>
  );
};

export default FadeFrom;
