import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { View, TextInput } from 'react-native';
import { styles } from './InputNumber';
import usePhoneValidationStore from '../usePhoneValidationStore';
import i18n from '../../../../services/i18n.service';
import Button from '../../../Button';
import ThemedStyles from '../../../../../styles/ThemedStyles';
import MText from '../../../MText';
import { useBackHandler } from '@react-native-community/hooks';

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
    <View>
      <MText style={localStyles.codeSent}>{`${i18n.t('onboarding.codeSent')} ${
        store?.phone
      }`}</MText>
      <View style={styles.mainContainer}>
        <MText style={styles.label}>
          {i18n.t('onboarding.confirmationCode')}
        </MText>
        {Boolean(store?.error) && (
          <MText style={styles.error}>{store?.error}</MText>
        )}
        <TextInput
          value={store?.code}
          onChangeText={store?.setCode}
          keyboardType="numeric"
          style={ThemedStyles.style.colorPrimaryText}
        />
      </View>
      <Button
        text={i18n.t('confirm')}
        containerStyle={styles.buttonContainer}
        onPress={store?.confirmAction}
      />
    </View>
  );
});

const localStyles = ThemedStyles.create({
  codeSent: ['fontLM', 'textCenter', 'marginBottom8x'],
});

export default ConfirmNumber;
