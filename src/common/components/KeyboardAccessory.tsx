import React from 'react';
import {
  View,
  Platform,
  Keyboard,
  UIManager,
  LayoutAnimation,
  KeyboardEventName,
} from 'react-native';
import ThemedStyles, { useStyle } from '../../styles/ThemedStyles';

import isIphoneX from '../helpers/isIphoneX';

const SAFE_AREA_BOTTOM_HEIGHT = 34;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

let keyboardShowEvent: KeyboardEventName = 'keyboardWillShow';
let keyboardHideEvent: KeyboardEventName = 'keyboardWillHide';

if (Platform.OS === 'android') {
  keyboardShowEvent = 'keyboardDidShow';
  keyboardHideEvent = 'keyboardDidHide';
}

type PropsType = {
  noFloat?: boolean;
  addToBottom?: number;
  children: React.ReactNode;
  show: boolean;
  backgroundColor?: string;
};

/**
 * Based on https://github.com/just4fun/react-native-sticky-keyboard-accessory
 * fixed for android
 */
export default function (props: PropsType) {
  const [bottom, setBottom] = React.useState(0);

  // calculate new bottom position when keyboard shows
  const keyboardShow = React.useCallback(
    e => {
      let newBottom;
      LayoutAnimation.easeInEaseOut();

      if (Platform.OS === 'android') {
        newBottom = 0;
      } else {
        newBottom = isIphoneX
          ? e.endCoordinates.height - SAFE_AREA_BOTTOM_HEIGHT
          : e.endCoordinates.height;
      }

      if (bottom !== newBottom) {
        setBottom(newBottom);
      }
    },
    [bottom],
  );

  // when keyaboard hides, just set bottom to 0
  const keyboardHide = React.useCallback(e => {
    LayoutAnimation.easeInEaseOut();
    setBottom(0);
  }, []);

  // add listeners to keyaboard events
  React.useEffect(() => {
    if (props.noFloat) {
      const showSubscription = Keyboard.addListener(keyboardShowEvent, e =>
        keyboardShow(e),
      );

      const hideSubscription = Keyboard.addListener(keyboardHideEvent, e =>
        keyboardHide(e),
      );

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }
  }, [keyboardHide, keyboardShow, props.noFloat]);

  const { children, backgroundColor, noFloat, show, addToBottom } = props;

  let basicStyle: any = { bottom: addToBottom ? bottom + addToBottom : bottom };
  if (backgroundColor) {
    basicStyle.backgroundColor = backgroundColor;
  }
  const noFloatStyle = useStyle('bgPrimaryBackgroundHighlight', basicStyle);
  const floatStyle = useStyle(styles.container, basicStyle);
  const containerStyle = noFloat ? noFloatStyle : floatStyle;

  if (!show) {
    return null;
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = ThemedStyles.create({
  container: [
    'bgPrimaryBackgroundHighlight',
    {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
  ],
});
