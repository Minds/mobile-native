import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { styles } from './InputNumber';
import usePhoneValidationStore from '../usePhoneValidationStore';
import i18n from '../../../../services/i18n.service';
import Button from '../../../Button';
import ThemedStyles from '../../../../../styles/ThemedStyles';
import MText from '../../../MText';
import { useBackHandler } from '@react-native-community/hooks';
import InputContainer from '~/common/components/InputContainer';

type PropsType = {};

const ConfirmNumber = observer(({}: PropsType) => {
  const store = usePhoneValidationStore();

  // Disable back button on Android
  useBackHandler(
    useCallback(() => {
      return true;
    }, []),
  );

  return (
    <>
      <MText style={localStyles.codeSent}>{`${i18n.t('onboarding.codeSent')} ${
        store?.phone
      }`}</MText>
      <InputContainer
        placeholder={i18n.t('onboarding.confirmationCode')}
        onChangeText={store?.setCode}
        value={store?.code}
        keyboardType="numeric"
        error={store?.error}
      />
      <Button
        text={i18n.t('confirm')}
        containerStyle={styles.buttonContainer}
        onPress={store?.confirmAction}
      />
    </>
  );
});

const localStyles = ThemedStyles.create({
  codeSent: ['fontLM', 'textCenter', 'marginBottom8x'],
});

export default ConfirmNumber;
