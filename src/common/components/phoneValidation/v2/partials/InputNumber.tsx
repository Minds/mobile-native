import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import usePhoneValidationStore from '../usePhoneValidationStore';
import ThemedStyles from '../../../../../styles/ThemedStyles';
import i18n from '../../../../services/i18n.service';
import Button from '../../../Button';
import MText from '../../../MText';

type PropsType = {};

const InputNumber = observer(({}: PropsType) => {
  const store = usePhoneValidationStore();
  const phoneInput = React.useRef<PhoneInput>(null);

  React.useEffect(() => {
    store?.setPhoneInputRef(phoneInput);
    return () => {
      store?.setPhoneInputRef(null);
    };
  }, [phoneInput, store]);

  return (
    <View>
      <View style={styles.mainContainer}>
        <MText style={styles.label}>{i18n.t('onboarding.phoneNumber')}</MText>
        {Boolean(store?.error) && (
          <MText style={styles.error}>{store?.error}</MText>
        )}
        <PhoneInput
          ref={phoneInput}
          defaultCode="US"
          layout="first"
          onChangeFormattedText={store?.setPhone}
          placeholder=" "
          {...phoneInputStyles}
        />
      </View>
      <Button
        text={i18n.t('onboarding.send')}
        containerStyle={styles.buttonContainer}
        onPress={store?.joinAction}
      />
    </View>
  );
});

const phoneInputStyles = ThemedStyles.create({
  containerStyle: ['bgPrimaryBackgroundHighlight'],
  textContainerStyle: ['bgPrimaryBackgroundHighlight'],
  codeTextStyle: ['colorPrimaryText'],
  textInputStyle: ['colorPrimaryText'],
  flagButtonStyle: [{ justifyContent: 'flex-start', width: 20 }],
});

export const styles = ThemedStyles.create({
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
