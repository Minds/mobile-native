import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  TextInputProps,
  Keyboard,
} from 'react-native';
import type { TextInput as TextInputType } from 'react-native';
import { Portal } from '@gorhom/portal';

import KeyboardSpacingView from './keyboard/KeyboardSpacingView';
import ThemedStyles from '../../styles/ThemedStyles';
import preventDoubleTap from '../../common/components/PreventDoubleTap';
import { Flow } from 'react-native-animated-spinkit';
import TextInput from '../../common/components/TextInput';
import { FullWindowOverlay } from 'react-native-screens';

const { height } = Dimensions.get('window');

const Touchable = preventDoubleTap(TouchableOpacity);

type PropsType = {
  progress?: boolean;
  hideKeyboard?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
} & TextInputProps;

/**
 * Floating Input component
 */
const FloatingInput = React.forwardRef(
  (
    {
      onSubmit,
      progress,
      onCancel,
      children,
      hideKeyboard,
      ...props
    }: PropsType,
    ref,
  ) => {
    const theme = ThemedStyles.style;
    const inputRef = React.useRef<TextInputType>(null);
    const [show, setShow] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      show() {
        hideKeyboard && Keyboard.dismiss();
        setShow(true);
      },
      hide() {
        setShow(false);
      },
    }));

    if (!show) {
      return null;
    }

    const key = 'FloatingInputPortal';

    return (
      <Portal key={key} name={key}>
        <FullWindowOverlay
          //@ts-ignore missing style type
          style={StyleSheet.absoluteFill}>
          <KeyboardSpacingView
            enabled
            translate
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none">
            <View style={styles.mainContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShow(false);
                  onCancel && onCancel();
                }}
                style={styles.backdrop}
              />
              <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                  <TextInput
                    ref={inputRef}
                    autoFocus={true}
                    placeholderTextColor={ThemedStyles.getColor('TertiaryText')}
                    underlineColorAndroid="transparent"
                    {...props}
                    style={styles.input}
                  />
                  {!progress ? (
                    onSubmit ? (
                      <View>
                        <Touchable
                          onPress={onSubmit}
                          testID="submitButton"
                          style={theme.paddingBottom}>
                          {children}
                        </Touchable>
                      </View>
                    ) : null
                  ) : (
                    <View style={styles.indicator}>
                      <Flow color={ThemedStyles.getColor('PrimaryText')} />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </KeyboardSpacingView>
        </FullWindowOverlay>
      </Portal>
    );
  },
);

export default FloatingInput;

const styles = ThemedStyles.create({
  mainContainer: ['justifyEnd', 'flexContainer'],
  backdrop: ['flexContainer', 'bgBlack', 'opacity50'],
  indicator: ['alignSelfCenter', 'justifyEnd'],
  inputRow: ['rowJustifyStart', 'alignEnd', 'paddingHorizontal4x'],
  meta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 16,
  },
  preview: {
    minHeight: 80,
    margin: 10,
  },
  sendIconCont: {
    paddingBottom: Platform.select({
      android: 13,
      ios: 8,
    }),
  },
  input: [
    'colorPrimaryText',
    'fontL',
    'fullWidth',
    {
      minHeight: 35,
      flex: 3,
      lineHeight: 22,
      maxHeight: height * 0.4,
    },
  ],
  inputContainer: [
    'bgPrimaryBackground',
    {
      shadowColor: 'black',
      maxHeight: height * 0.4,
      width: '100%',
      borderColor: 'transparent',
      ...Platform.select({
        android: { paddingTop: 7, paddingBottom: 9 },
        ios: { paddingTop: 10, paddingBottom: 12 },
      }),
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 16,
    },
  ],
});
