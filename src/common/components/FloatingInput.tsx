import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  TextInputProps,
} from 'react-native';
import type { TextInput as TextInputType } from 'react-native';
import SoftInputMode from 'react-native-set-soft-input-mode';
import { Portal } from '@gorhom/portal';

import KeyboardSpacingView from '../../common/components/KeyboardSpacingView';
import ThemedStyles from '../../styles/ThemedStyles';
import preventDoubleTap from '../../common/components/PreventDoubleTap';
import { DotIndicator } from 'react-native-reanimated-indicators';
import TextInput from '../../common/components/TextInput';

const { height } = Dimensions.get('window');

const Touchable = preventDoubleTap(TouchableOpacity);

type PropsType = {
  progress?: boolean;
  onSubmit: () => void;
  children?: React.ReactNode;
} & TextInputProps;

/**
 * Floating Input component
 */
const FloatingInput = React.forwardRef(
  ({ onSubmit, progress, children, ...props }: PropsType, ref) => {
    const theme = ThemedStyles.style;
    const inputRef = React.useRef<TextInputType>(null);
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
      // workaround to fix the keyboard handling based on the platform
      if (Platform.OS === 'android') {
        SoftInputMode.set(SoftInputMode.ADJUST_RESIZE);
        return () => SoftInputMode.set(SoftInputMode.ADJUST_PAN);
      }
    }, []);

    React.useImperativeHandle(ref, () => ({
      show() {
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
        <KeyboardSpacingView
          style={StyleSheet.absoluteFill}
          enabled={Platform.OS === 'ios'}
          pointerEvents="box-none">
          <View style={styles.mainContainer}>
            <TouchableOpacity
              onPress={() => setShow(false)}
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
                {!progress && children ? (
                  <View>
                    <Touchable
                      onPress={onSubmit}
                      testID="submitButton"
                      style={theme.paddingBottom}>
                      {children}
                    </Touchable>
                  </View>
                ) : (
                  <View>
                    <DotIndicator
                      containerStyle={styles.indicator}
                      color={ThemedStyles.getColor('PrimaryText')}
                      scaleEnabled={true}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </KeyboardSpacingView>
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
