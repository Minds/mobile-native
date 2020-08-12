import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import { Animated } from 'react-native';
const { multiply } = Animated;

const animSpec = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10,
  },
};

/**
 * Auth stack custom transition
 */
const AuthTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: animSpec,
    close: animSpec,
  },
  cardStyleInterpolator: function ({
    current,
    next,
    inverted,
    layouts: { screen },
  }: StackCardInterpolationProps): StackCardInterpolatedStyle {
    const rotateY = multiply(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1.3, 0],
        extrapolate: 'identity',
      }),
      inverted,
    );

    const translateX = multiply(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [screen.width, 0],
        extrapolate: 'clamp',
      }),
      inverted,
    );

    const translateUnfocused = next
      ? multiply(
          next.progress.interpolate({
            inputRange: [0, 0.4],
            outputRange: [0, -screen.width],
            extrapolate: 'clamp',
          }),
          inverted,
        )
      : 0;

    return {
      cardStyle: {
        transform: [
          // Translation for the animation of the current card
          {
            translateX: translateUnfocused,
          },
          { translateX },
          {perspective: 1000 },
          { rotateY }
        ],
      },
    };
  },
};

export default AuthTransition;
