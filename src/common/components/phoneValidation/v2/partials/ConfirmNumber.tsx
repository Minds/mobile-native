import React from 'react';
import { observer } from 'mobx-react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './InputNumber';
import usePhoneValidationStore from '../usePhoneValidationStore';
import i18n from '../../../../services/i18n.service';
import Button from '../../../Button';
import ThemedStyles from '../../../../../styles/ThemedStyles';

type PropsType = {};

const ConfirmNumber = observer(({}: PropsType) => {
  const store = usePhoneValidationStore();
  return (
    <View>
      <Text style={localStyles.codeSent}>{`${i18n.t('onboarding.codeSent')} ${
        store?.phone
      }`}</Text>
      <View style={styles.mainContainer}>
        <Text style={styles.label}>
          {i18n.t('onboarding.confirmationCode')}
        </Text>
        {Boolean(store?.error) && (
          <Text style={styles.error}>{store?.error}</Text>
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
