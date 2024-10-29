import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { useBackHandler } from '@react-native-community/hooks';

import { styles } from './InputNumber';
import Button from '../../../Button';

import MText from '../../../MText';
import InputContainer from '~/common/components/InputContainer';
import usePhoneValidationStore from '../usePhoneValidationStore';
import sp from '~/services/serviceProvider';

type PropsType = {};

const ConfirmNumber = observer(({}: PropsType) => {
  const store = usePhoneValidationStore();
  const i18n = sp.i18n;
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

const localStyles = sp.styles.create({
  codeSent: ['fontLM', 'textCenter', 'marginBottom8x'],
});

export default ConfirmNumber;
