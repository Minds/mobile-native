import React from 'react';
import Icon from '@expo/vector-icons/SimpleLineIcons';
import { useMemoStyle } from '../../styles/ThemedStyles';

type PropsType = {
  x: number;
  y: number;
};

/**
 * Floating focus indicator component
 */
export default function FocusIndicator({ x, y }: PropsType) {
  const style = useMemoStyle(
    [
      'colorWhite',
      'opacity75',
      {
        textShadowColor: '#000000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        top: y - 23,
        left: x - 23,
        position: 'absolute',
      },
    ],
    [x, y],
  );
  return <Icon name="frame" size={45} style={style} />;
}
