import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import SaveButton from '../../common/components/SaveButton';
import i18n from '../../common/services/i18n.service';
import { showNotification } from '../../../AppMessages';
import LabeledComponent from '../../common/components/LabeledComponent';
import PhoneValidationComponent from '../../common/components/phoneValidation/PhoneValidationComponent';
import createPhoneValidationStore from '../../common/components/phoneValidation/createLocalStore';
import { useLegacyStores } from '../../common/hooks/use-stores';

type VerifyPhoneNumberRouteProp = RouteProp<
  AppStackParamList,
  'VerifyPhoneNumberScreen'
>;

type PropsType = {
  route: VerifyPhoneNumberRouteProp;
};

type ButtonTextType = 'onboarding.send' | 'confirm';
type LabelText = 'onboarding.phoneNumber' | 'onboarding.confirmationCode';

const getTitle = (step: ButtonTextType) => {
  return i18n.t(
    `settings.TFAVerifyPhoneTitle${step === 'confirm' ? '2' : '1'}`,
  );
};
const getDesc = (step: ButtonTextType, phone?: string) => {
  return step === 'confirm'
    ? `${i18n.t('settings.TFAVerifyPhoneDesc2')} ${phone}`
    : i18n.t('settings.TFAVerifyPhoneDesc1');
};

const VerifyPhoneNumberScreen = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;
  const store = route.params.store;
  const navigation = useNavigation();
  const phoneValidationStore = useLocalStore(createPhoneValidationStore);
  const user = useLegacyStores().user;
  const localStore = useLocalStore(() => ({
    buttonText: 'onboarding.send' as ButtonTextType,
    labelText: 'onboarding.phoneNumber' as LabelText,
    async verify() {
      try {
        await phoneValidationStore.confirmAction(user, true);
        store.setAuthEnabled('sms');
        navigation.goBack();
        showNotification(i18n.t('settings.TFAEnabled'));
      } catch (err) {}
    },
    async send() {
      try {
        await phoneValidationStore.joinAction();
        this.buttonText = 'confirm';
        this.labelText = 'onboarding.confirmationCode';
      } catch (err) {}
    },
    get onContinue() {
      return this.buttonText === 'confirm' ? this.verify : this.send;
    },
  }));

  navigation.setOptions({
    headerRight: () => (
      <SaveButton
        onPress={localStore.onContinue}
        text={i18n.t('continue')}
        style={!phoneValidationStore.phone ? theme.colorSecondaryText : {}}
      />
    ),
  });

  return (
    <ScrollView style={[theme.flexContainer, theme.paddingTop7x]}>
      <Text style={styles.title}>{getTitle(localStore.buttonText)}</Text>
      <Text style={[styles.text, theme.colorSecondaryText]}>
        {getDesc(localStore.buttonText, phoneValidationStore.phone)}
      </Text>
      <LabeledComponent
        label={i18n.t(localStore.labelText)}
        wrapperStyle={[
          theme.padding4x,
          theme.borderTopHair,
          theme.borderBottomHair,
          theme.borderIcon,
          theme.backgroundSecondary,
        ]}>
        <PhoneValidationComponent
          textStyle={theme.colorPrimaryText}
          inputStyles={[theme.colorPrimaryText, theme.border0x, styles.input]}
          inputWrapperStyle={styles.inputWrapperStyle}
          localStore={phoneValidationStore}
          bottomStore={true}
          autoFocus
        />
      </LabeledComponent>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  title: {
    paddingLeft: 20,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
  },
  smallTitle: {
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    marginVertical: 35,
  },
  input: {
    height: 30,
    flexBasis: 0,
    flexGrow: 1,
    padding: 0,
  },
  inputWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});

export default VerifyPhoneNumberScreen;
