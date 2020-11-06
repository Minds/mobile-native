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

const ModalTransition = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: animSpec,
    close: animSpec,
  },
  cardStyleInterpolator: function ({
    current,
    inverted,
    layouts: { screen },
  }: StackCardInterpolationProps): StackCardInterpolatedStyle {
    const translateY = multiply(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [screen.height, 0],
        extrapolate: 'clamp',
      }),
      inverted,
    );

    const opacity = multiply(current.progress, inverted);

    return {
      cardStyle: {
        opacity,
        transform: [
          // Translation for the animation of the current card
          { translateY },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.75],
          extrapolate: 'clamp',
        }),
      },
    };
  },
};

export default ModalTransition;
