/**
 * Based on the article: https://chrisfrewin.medium.com/a-keyboard-avoiding-view-for-react-native-in-2021-196701ff0608
 * But implemented with reanimated
 */

import React, { useEffect } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEventName,
  TextInput,
  ViewProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { IS_IOS } from '~/config/Config';
import { useHeaderHeight } from '@react-navigation/elements';

interface Props extends ViewProps {
  headerOffset?: number;
  children: any;
  enabled?: boolean;
}

/**
 * In order to work properly this component needs to be in the root of the screen
 * @param props
 * @returns
 */
export default function KeyboardShiftView(props: Props) {
  const { children, headerOffset, style, enabled = true, ...others } = props;
  const shift = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: shift.value }] };
  });

  const handleKeyboardDidShow = e => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = e.endCoordinates.height;
    const currentlyFocusedInputRef = TextInput.State.currentlyFocusedInput();
    currentlyFocusedInputRef.measure(
      (_x, _y, _width, height, _pageX, pageY) => {
        const gap = windowHeight - keyboardHeight - (pageY + height);
        if (gap >= 0 || !enabled) {
          return;
        }

        shift.value = withTiming(gap, { duration: 250 });
      },
    );
  };

  const handleKeyboardDidHide = () => {
    shift.value = withTiming(0, { duration: 250 });
  };

  // On mount, add keyboard show and hide listeners
  // On unmount, remove them
  useEffect(() => {
    const eventShow = IS_IOS
      ? 'keyboardWillShow'
      : ('keyboardDidShow' as KeyboardEventName);
    const eventHide = IS_IOS
      ? 'keyboardWillHide'
      : ('keyboardDidHide' as KeyboardEventName);
    const show = Keyboard.addListener(eventShow, handleKeyboardDidShow);
    const hide = Keyboard.addListener(eventHide, handleKeyboardDidHide);
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const headerHeight = useHeaderHeight();

  // Android: we need an animated view since the keyboard style can vary widely
  // And React Native's KeyboardAvoidingView isn't always reliable
  if (!IS_IOS) {
    return (
      <Animated.View style={[animatedStyles, style]} {...others}>
        {children}
      </Animated.View>
    );
  }

  // iOS: React Native's KeyboardAvoidingView with header offset and
  // behavior 'padding' works fine on all ios devices (and keyboard types)

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight || headerOffset || 0}
      style={style}
      behavior={'padding'}
      {...others}>
      {children}
    </KeyboardAvoidingView>
  );
}
