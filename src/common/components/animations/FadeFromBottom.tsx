import React, { FC } from 'react';
import { View as MotiView } from 'moti';

const from = { opacity: 0, translateY: 50 };
const animate = { opacity: 1, translateY: 0 };

/**
 * Fade content from bottom
 */
export const FadeFromBottom: FC = ({ children, ...props }) => {
  return (
    <MotiView {...props} from={from} animate={animate}>
      {children}
    </MotiView>
  );
};

export default FadeFromBottom;
