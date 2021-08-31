import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { FC } from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';

interface FadeViewProps extends ViewProps {
  fades: ('left' | 'right' | 'top' | 'bottom')[];
  fadeLength?: number;
}

/**
 * a View that has linear gradients on selected sides (top, bottom, left, right)
 **/
const FadeView: FC<FadeViewProps> = ({
  children,
  fades,
  fadeLength = 20,
  ...props
}) => {
  const backgroundColor = ThemedStyles.getColor('PrimaryBackground');
  const endColor = backgroundColor + 'FF';
  const startColor = backgroundColor + '00';

  const fadeComponents = useMemo(() => {
    const array: JSX.Element[] = [];

    const createGradient = props => (
      <LinearGradient pointerEvents="none" {...props} />
    );

    fades.map(fade => {
      switch (fade) {
        case 'left':
          array.push(
            createGradient({
              colors: [startColor, endColor],
              start: [0, 1],
              style: {
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: fadeLength,
              },
            }),
          );
          break;
        case 'right':
          array.push(
            createGradient({
              colors: [endColor, startColor],
              start: [0, 1],
              style: {
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: fadeLength,
              },
            }),
          );
          break;
        case 'top':
          array.push(
            createGradient({
              colors: [startColor, endColor],
              style: {
                position: 'absolute',
                right: 0,
                top: 0,
                left: 0,
                height: fadeLength,
              },
            }),
          );
          break;
        case 'bottom':
          array.push(
            createGradient({
              colors: [endColor, startColor],
              style: {
                position: 'absolute',
                right: 0,
                bottom: 0,
                left: 0,
                height: fadeLength,
              },
            }),
          );
          break;
      }
    });

    return array;
  }, [fades]);

  return (
    <View {...props}>
      {children}
      {fadeComponents}
    </View>
  );
};

export default FadeView;
