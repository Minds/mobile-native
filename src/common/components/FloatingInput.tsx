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
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { Flow } from 'react-native-animated-spinkit';
import TextInput from '../../common/components/TextInput';
import { FullWindowOverlay } from 'react-native-screens';
import { H3 } from '../ui';
import sp from '~/services/serviceProvider';

const { height } = Dimensions.get('window');

type PropsType = {
  /**
   * If true, the progress indicator will be shown
   */
  progress?: boolean;
  /**
   * If true, the keyboard will be hidden when the input is shown
   */
  hideKeyboard?: boolean;
  /**
   * If true, the submit button will be placed on a new row
   */
  submitNewRow?: boolean;
  title?: string;
  onCancel?: () => void;
  children?: React.ReactNode;
} & TextInputProps;

/**
 * Floating Input component
 */
const FloatingInput = React.forwardRef(
  (
    {
      submitNewRow,
      progress,
      title,
      onCancel,
      children,
      hideKeyboard,
      ...props
    }: PropsType,
    ref,
  ) => {
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
          <KeyboardAvoidingView
            behavior="padding"
            pointerEvents="box-none"
            style={StyleSheet.absoluteFill}>
            <View style={styles.mainContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShow(false);
                  onCancel && onCancel();
                }}
                style={styles.backdrop}
              />
              <View style={styles.inputContainer}>
                {Boolean(title) && (
                  <View style={styles.title}>
                    <H3 font="medium">{title}</H3>
                  </View>
                )}
                <View style={styles.inputRow}>
                  <TextInput
                    ref={inputRef}
                    autoFocus={true}
                    placeholderTextColor={sp.styles.getColor('TertiaryText')}
                    underlineColorAndroid="transparent"
                    {...props}
                    style={styles.input}
                  />
                  {!submitNewRow ? (
                    <Submit progress={progress}>{children}</Submit>
                  ) : null}
                </View>
                {submitNewRow ? (
                  <Submit progress={progress}>{children}</Submit>
                ) : null}
              </View>
            </View>
          </KeyboardAvoidingView>
        </FullWindowOverlay>
      </Portal>
    );
  },
);

const Submit = ({
  children,
  progress,
}: {
  progress?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <>
      {!progress ? (
        children
      ) : (
        <View style={styles.indicator}>
          <Flow color={sp.styles.getColor('PrimaryText')} />
        </View>
      )}
    </>
  );
};

export default React.memo(FloatingInput);

const styles = sp.styles.create({
  mainContainer: ['justifyEnd', 'flexContainer'],
  backdrop: ['flexContainer', 'bgBlack', 'opacity50'],
  indicator: ['alignSelfCenter', 'justifyEnd'],
  inputRow: ['rowJustifyStart', 'alignEnd', 'paddingHorizontal4x'],
  title: ['rowJustifyCenter', 'paddingHorizontal4x', 'marginBottom3x'],
  input: [
    'colorPrimaryText',
    'fontL',
    'fullWidth',
    'bcolorPrimaryBorder',
    'border',
    'borderRadius3x',
    'paddingHorizontal2x',
    {
      minHeight: 35,
      lineHeight: 18,
      maxHeight: height * 0.4,
    },
  ],
  inputContainer: [
    'bgSecondaryBackground',
    {
      paddingVertical: 30,
      shadowColor: 'black',
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      width: '100%',
      borderColor: 'transparent',
      ...Platform.select({
        android: { paddingTop: 12, paddingBottom: 70 },
        ios: { paddingTop: 15, paddingBottom: 17 },
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
