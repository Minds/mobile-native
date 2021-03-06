import { useNavigation, useRoute } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DismissKeyboard from '../../../common/components/DismissKeyboard';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import ModalContainer from './ModalContainer';
import PhoneValidationComponent from '../../../common/components/phoneValidation/PhoneValidationComponent';
import createPhoneValidationStore from '../../../common/components/phoneValidation/createLocalStore';
import LabeledComponent from '../../../common/components/LabeledComponent';
import Button from '../../../common/components/Button';
import { useLegacyStores } from '../../../common/hooks/use-stores';

type ButtonTextType = 'onboarding.send' | 'confirm';
type LabelText = 'onboarding.phoneNumber' | 'onboarding.confirmationCode';

export default observer(function PhoneValidationScreen() {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const route = useRoute<any>();
  // if onComplete means that it come from buy tokens or somthing like that
  const onComplete = route.params?.onComplete;
  const phoneValidationStore = useLocalStore(createPhoneValidationStore);
  const user = useLegacyStores().user;

  const store = useLocalStore(() => ({
    buttonText: 'onboarding.send' as ButtonTextType,
    labelText: 'onboarding.phoneNumber' as LabelText,
    async verify() {
      try {
        await phoneValidationStore.confirmAction(user);
        if (onComplete) {
          navigation.goBack();
          onComplete();
        } else {
          navigation.goBack();
          navigation.goBack();
        }
      } catch (err) {}
    },
    async send() {
      try {
        await phoneValidationStore.joinAction();
        store.buttonText = 'confirm';
        store.labelText = 'onboarding.confirmationCode';
      } catch (err) {}
    },
  }));

  const textStyle = [theme.colorPrimaryText, theme.marginBottom4x];

  return (
    <ModalContainer
      title={i18n.t('onboarding.phoneNumber')}
      onPressBack={navigation.goBack}>
      {store.labelText === 'onboarding.confirmationCode' && (
        <View style={theme.centered}>
          <Text style={textStyle}>{`${i18n.t('onboarding.sent')} ${
            phoneValidationStore.phone
          }`}</Text>
          <TouchableOpacity onPress={store.send}>
            <Text style={textStyle}>{i18n.t('onboarding.resend')}</Text>
          </TouchableOpacity>
        </View>
      )}
      <DismissKeyboard>
        <View style={theme.flexContainer}>
          {onComplete && (
            <Text style={theme.padding4x}>
              {i18n.t('onboarding.mustVerify')}{' '}
              <Text
                style={theme.colorLink}
                onPress={() =>
                  Linking.openURL('https://www.minds.com/p/privacy')
                }>
                {i18n.t('clickHere')}
              </Text>
            </Text>
          )}
          <LabeledComponent
            label={i18n.t(store.labelText)}
            wrapperStyle={[
              theme.padding4x,
              theme.borderTopHair,
              theme.borderBottomHair,
              theme.borderIcon,
              theme.backgroundSecondary,
            ]}>
            <PhoneValidationComponent
              textStyle={theme.colorPrimaryText}
              inputStyles={[
                theme.colorPrimaryText,
                theme.border0x,
                styles.input,
              ]}
              inputWrapperStyle={styles.inputWrapperStyle}
              localStore={phoneValidationStore}
              bottomStore={true}
              autoFocus
            />
          </LabeledComponent>
          <View
            style={[
              theme.paddingHorizontal4x,
              theme.marginBottom2x,
              styles.buttonContainer,
            ]}>
            <Button
              onPress={
                store.buttonText === 'onboarding.send'
                  ? store.send
                  : store.verify
              }
              text={i18n.t(store.buttonText)}
              containerStyle={[
                theme.transparentButton,
                theme.paddingVertical3x,
                theme.fullWidth,
                theme.marginTop,
                theme.borderPrimary,
              ]}
              textStyle={theme.buttonText}
            />
          </View>
        </View>
      </DismissKeyboard>
    </ModalContainer>
  );
});

const styles = StyleSheet.create({
  input: {
    height: 30,
    flexBasis: 0,
    flexGrow: 1,
    padding: 0,
  },
  buttonContainer: {
    marginTop: 40,
  },
  inputWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
