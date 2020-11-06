import React, { useEffect, useState } from 'react';
import { Keyboard, StatusBar, View, ViewProps } from 'react-native';
import { mix, useTransition } from 'react-native-redash';
import Animated from 'react-native-reanimated';
import { observer, useLocalStore } from 'mobx-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedStyles from '../../styles/ThemedStyles';

interface PropsType extends ViewProps {
  children: React.ReactNode;
  enabled?: boolean;
  onKeyboardShown?: (height: number) => void;
}

export const screenRealHeightContext = React.createContext<number>(0);

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
  const heightContext = React.useContext(screenRealHeightContext);
  const store = useLocalStore(
    ({ enabled: enabledProp }) => ({
      shown: false,
      height: 0,
      show(e) {
        if (enabledProp) {
          store.shown = true;
        }
        store.height = heightContext - e.endCoordinates.screenY;
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

/**
 * Screen height provider
 * It detects the real height of the screen to implement a workaround
 * for the incorrect keyboard height detection in some devices
 */
export const ScreenHeightProvider = ({ children }) => {
  const [height, setHeight] = useState(0);
  return (
    <View
      style={ThemedStyles.style.flexContainer}
      onLayout={({ nativeEvent }) =>
        setHeight(nativeEvent.layout.height + (StatusBar.currentHeight || 0))
      }>
      <screenRealHeightContext.Provider value={height}>
        {children}
      </screenRealHeightContext.Provider>
    </View>
  );
};
