import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import usePhoneValidationStore from '../usePhoneValidationStore';

import Button from '../../../Button';
import MText from '../../../MText';
import sp from '~/services/serviceProvider';

type PropsType = {};

const InputNumber = observer(({}: PropsType) => {
  const store = usePhoneValidationStore();
  const phoneInput = React.useRef<PhoneInput>(null);
  const textInputRef = React.useRef<TextInput>(null);
  const [textInputFocused, setTextInputFocused] = useState(false);
  const textInputProps: TextInputProps = useMemo(
    () => ({
      selectionColor: sp.styles.getColor('Link'),
      ref: textInputRef,
      onFocus: () => setTextInputFocused(true),
      onBlur: () => setTextInputFocused(false),
    }),
    [],
  );

  const onContainerPress = useCallback(
    () => textInputRef.current?.focus(),
    [textInputRef],
  );

  React.useEffect(() => {
    store?.setPhoneInputRef(phoneInput);
    return () => {
      store?.setPhoneInputRef(null);
    };
  }, [phoneInput, store]);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.mainContainer}
        onPress={textInputFocused ? undefined : onContainerPress}>
        <MText style={styles.label}>
          {sp.i18n.t('onboarding.phoneNumber')}
        </MText>
        {Boolean(store?.error) && (
          <MText style={styles.error}>{store?.error}</MText>
        )}
        <PhoneInput
          ref={phoneInput}
          defaultCode="US"
          layout="first"
          onChangeFormattedText={store?.setPhone}
          placeholder=" "
          textInputProps={textInputProps}
          autoFocus
          {...phoneInputStyles}
        />
      </TouchableOpacity>
      <Button
        text={sp.i18n.t('onboarding.send')}
        containerStyle={styles.buttonContainer}
        onPress={store?.joinAction}
      />
    </View>
  );
});

const phoneInputStyles = sp.styles.create({
  containerStyle: ['bgPrimaryBackgroundHighlight'],
  textContainerStyle: ['bgPrimaryBackgroundHighlight'],
  codeTextStyle: ['colorPrimaryText'],
  textInputStyle: ['colorPrimaryText'],
  flagButtonStyle: [{ justifyContent: 'flex-start', width: 20 }],
});

export const styles = sp.styles.create({
  label: ['colorSecondaryText', 'fontL'],
  mainContainer: [
    'bgPrimaryBackgroundHighlight',
    { paddingTop: 15, paddingLeft: 22 },
    'bcolorPrimaryBorder',
    'borderTopHair',
    'borderBottomHair',
  ],
  buttonContainer: [
    'marginTop8x',
    'bgPrimaryBackgroundHighlight',
    'width80',
    { paddingVertical: 18, borderRadius: 30 },
  ],
  error: ['colorAlert', 'fontS'],
});

export default InputNumber;
