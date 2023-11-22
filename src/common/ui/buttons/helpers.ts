import { Animated } from 'react-native';
import ThemedStyles from '~styles/ThemedStyles';
import { LayoutAnimation } from 'react-native';
import { Btn1, Btn2, Btn3 } from '~ui/typography';

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

type PropsForColor = {
  theme: number;
  mode?: string;
  darkContent?: boolean;
  disabled?: boolean;
  type?: string;
  lightContent?: boolean;
};

export const getColor = ({
  theme,
  mode = 'solid',
  darkContent = false,
  lightContent,
  disabled = false,
  type = 'action',
}: PropsForColor) => {
  let textColor:
    | 'primary'
    | 'link'
    | 'tertiary'
    | 'white'
    | 'black'
    | 'danger'
    | undefined = 'primary';
  let spinnerColor = ThemedStyles.style.colorPrimaryText.color || 'grey';

  if ((mode === 'solid' || darkContent) && !disabled) {
    textColor = theme === 1 && type === 'action' ? 'black' : 'white';

    return {
      textColor,
      spinnerColor: textColor,
    };
  }

  if (lightContent || darkContent) {
    textColor = lightContent ? 'black' : 'white';
    spinnerColor = lightContent ? 'black' : 'white';
  }

  if (mode === 'flat') {
    if (type === 'action') {
      textColor = 'link';
    }
    if (type === 'warning') {
      textColor = 'danger';
    }
  }

  if (disabled) {
    textColor = 'tertiary';
  }

  return {
    textColor,
    spinnerColor,
  };
};

export function getFontRenderer(size): (props: any) => JSX.Element {
  switch (size) {
    case 'pill':
    case 'tiny':
      return Btn3;
    case 'small':
      return Btn2;
    case 'medium':
      return Btn1;
    case 'large':
      return Btn1;
    default:
      return Btn1;
  }
}

export const configureLayoutAnimation = () => {
  LayoutAnimation.configureNext({
    duration: 165,
    update: {
      springDamping: 0.9,
      type: 'spring',
    },
  });
};
