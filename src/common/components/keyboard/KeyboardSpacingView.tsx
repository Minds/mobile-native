import React from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IS_IOS } from '~/config/Config';

interface PropsType extends ViewProps {
  children: React.ReactNode;
  enabled?: boolean;
  translate?: boolean;
  safe?: boolean;
}

export const screenRealHeightContext = React.createContext<number>(0);

/**
 * This components leaves room for the keyboard adding a padding bellow it
 * in order to work as expected the bottom of the view should be at the bottom of the screen
 *
 * this component is disabled on android by default (we are using the adjustResizeMode that already resize the view)
 */
export default function KeyboardSpacingView({
  children,
  style,
  translate,
  enabled = !IS_IOS,
  safe,
  ...otherProps
}: PropsType) {
  const isEnabled = enabled !== false;
  const { bottom: bottomOffset } = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return !isEnabled
      ? {}
      : translate
      ? {
          transform: [{ translateY: -keyboard.height.value }],
        }
      : {
          paddingBottom:
            safe && bottomOffset
              ? keyboard.height.value - bottomOffset
              : keyboard.height.value,
        };
  });

  return (
    <Animated.View style={[translateStyle, style]} {...otherProps}>
      {children}
    </Animated.View>
  );
}
