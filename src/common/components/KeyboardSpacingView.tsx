import React, { useEffect } from 'react';
import { Keyboard, ViewProps } from 'react-native';
import { mix, useTransition } from 'react-native-redash';
import Animated from 'react-native-reanimated';
import { observer, useLocalStore } from 'mobx-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PropsType extends ViewProps {
  children: React.ReactNode;
  enabled?: boolean;
  onKeyboardShown?: (height: number) => void;
}

/**
 * This components leaves room for the keyboard adding a padding bellow it
 * in order to work as expected the bottom of the view should be at the bottom of the screen
 */
export default observer(function KeyboardSpacingView({
  children,
  style,
  enabled = true,
  onKeyboardShown,
  ...otherProps
}: PropsType) {
  const insets = useSafeAreaInsets();
  const store = useLocalStore(
    ({ enabled: enabledProp }) => ({
      shown: false,
      height: 0,
      show(e) {
        if (enabledProp) {
          store.shown = true;
        }
        store.height = e.endCoordinates.height;
        if (onKeyboardShown) {
          onKeyboardShown(store.height);
        }
      },
      hide() {
        store.shown = false;
      },
    }),
    { enabled },
  );

  const transition = useTransition(store.shown);
  const paddingBottom = mix(transition, insets.bottom, store.height);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', store.show);
    Keyboard.addListener('keyboardDidHide', store.hide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', store.show);
      Keyboard.removeListener('keyboardDidHide', store.hide);
    };
  }, [store]);

  return (
    <Animated.View style={[style, { paddingBottom }]} {...otherProps}>
      {children}
    </Animated.View>
  );
});
