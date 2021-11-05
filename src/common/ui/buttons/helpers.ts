import { Animated } from 'react-native';
import ThemedStyles from '~styles/ThemedStyles';

const BOUNCE_CONFIG = {
  short: {
    mass: 1.1,
    damping: 28,
    stiffness: 1200,
  },
  long: {
    mass: 1.2,
    damping: 40,
    stiffness: 1100,
  },
  long_fast: {
    mass: 1.2,
    damping: 46,
    stiffness: 2000,
  },
};

export const bounceAnimation = (
  animation,
  toValue,
  type = 'short',
  callback = undefined,
) => {
  Animated.spring(animation, {
    toValue,
    ...BOUNCE_CONFIG[type],
    useNativeDriver: true,
  }).start(callback);
};

export const timingAnimation = (
  animation,
  toValue,
  callback: () => void = () => null,
  duration = 125,
) => {
  Animated.timing(animation, {
    toValue,
    duration,
    useNativeDriver: true,
  }).start(callback);
};

export const getColor = (theme, mode, darkContent, disabled) => {
  let textColor: 'primary' | 'link' | 'secondary' | 'white' | undefined =
    'primary';
  let spinnerColor = 'white';
  if ((theme === 0 && mode === 'solid') || (darkContent && mode !== 'solid')) {
    textColor = 'white';
    spinnerColor = 'white';
  }
  spinnerColor = ThemedStyles.style.colorPrimaryText.color || 'grey';

  if (disabled) {
    textColor = 'secondary';
  }
  return {
    textColor,
    spinnerColor,
  };
};
