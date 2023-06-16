import React from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { IS_IOS } from '~/config/Config';

interface PropsType extends ViewProps {
  children: React.ReactNode;
  enabled?: boolean;
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
  enabled = !IS_IOS,
  ...otherProps
}: PropsType) {
  const isEnabled = enabled !== false;
  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return !isEnabled
      ? {}
      : {
          transform: [{ translateY: -keyboard.height.value }],
        };
  });

  return (
    <Animated.View style={[translateStyle, style]} {...otherProps}>
      {children}
    </Animated.View>
  );
}
