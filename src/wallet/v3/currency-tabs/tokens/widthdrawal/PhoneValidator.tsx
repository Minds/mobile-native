import { observer, useLocalStore } from 'mobx-react';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomOptionsStoreType } from '../../../../../common/components/BottomOptionPopup';
import createLocalStore from '../../../../../common/components/phoneValidation/createLocalStore';
import PhoneValidationComponent from '../../../../../common/components/phoneValidation/PhoneValidationComponent';
import { useLegacyStores } from '../../../../../common/hooks/use-stores';
import i18n from '../../../../../common/services/i18n.service';
import ThemedStyles from '../../../../../styles/ThemedStyles';

type PhoneValidatorPropsType = {
  bottomStore: BottomOptionsStoreType;
};

const PhoneValidator = observer(({ bottomStore }: PhoneValidatorPropsType) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createLocalStore);
  const user = useLegacyStores().user;
  const [msg, setMsg] = useState(i18n.t('wallet.phoneValidationMessage'));
  const [label, setLabel] = useState(i18n.t('onboarding.phoneNumber'));

  const verify = async () => {
    await localStore.confirmAction(user);
    bottomStore.doneText = i18n.t('done');
    setLabel('');
    bottomStore.setOnPressDone(() => bottomStore.hide());
  };

  const send = async () => {
    await localStore.joinAction();
    bottomStore.doneText = i18n.t('verify');
    bottomStore.setOnPressDone(verify);
    setMsg('');
    setLabel(i18n.t('onboarding.confirmationCode'));
  };

  bottomStore.setOnPressDone(send);

  return (
    <View>
      <Text style={[theme.padding4x, theme.colorSecondaryText]}>{msg}</Text>
      <View
        style={[
          theme.backgroundPrimary,
          theme.borderPrimary,
          styles.inputWraper,
        ]}>
        <Text style={[theme.colorSecondaryText]}>{label}</Text>
        <PhoneValidationComponent
          textStyle={theme.colorPrimaryText}
          inputStyles={[theme.colorPrimaryText, theme.border0x, styles.input]}
          bottomStore={bottomStore}
          localStore={localStore}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    height: 30,
    flexBasis: 0,
    flexGrow: 1,
    padding: 0,
  },
  inputWraper: {
    padding: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
});

export default PhoneValidator;
