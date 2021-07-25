import React, { useRef } from 'react';
import {
  View,
  Platform,
  Text,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { observer, useLocalStore } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';

import InputContainer from '../common/components/InputContainer';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import { styles, shadowOpt, icon } from './styles';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import BoxShadow from '../common/components/BoxShadow';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../common/components/Button';
import { DARK_THEME } from '../styles/Colors';
import DismissKeyboard from '../common/components/DismissKeyboard';
import validatePassword from '../common/helpers/validatePassword';
import { showNotification } from '../../AppMessages';
import validatorService from '../common/services/validator.service';
import authService from './AuthService';
import apiService from '../common/services/api.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';
import FitScrollView from '../common/components/FitScrollView';
import sessionService from '../common/services/session.service';
import featuresService from '../common/services/features.service';
import PasswordInput from '../common/components/password-input/PasswordInput';
import jwt from 'jsonwebtoken';

export type WalletScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register',
>;

type PropsType = {
  navigation: WalletScreenNavigationProp,
};

const shadowOptLocal = Object.assign({}, shadowOpt);
shadowOptLocal.height = 300;

const alphanumericPattern = '^[a-zA-Z0-9_]+$';

/**
 * ATTENTION
 * THIS IS A WORK IN PROGRESS
 * We need to resolve on how are we gonna receive the sharedKey
 */
export default observer(function RegisterScreen(props: PropsType) {
  const store = useLocalStore(() => ({
    focused: false,
    error: {},
    password: '',
    passwordFocused: false,
    username: '',
    email: '',
    termsAccepted: false,
    exclusivePromotions: true,
    hidePassword: true,
    inProgress: false,
    showErrors: false,
    onCaptchResult: async () => {
      store.inProgress = true;

      // the captcha that we will be sending to the register so the engine validate the token
      const captcha = Date.now();

      // try just replacing with the secret for testing
      const secret = process.env.sharedKey;

      try {
        // the token that we send within the captcha bypass cookie
        const token = jwt.sign({ data: captcha }, secret, {
          expiresIn: '5m',
        });

        const params = {
          username: store.username,
          email: store.email,
          password: store.password,
          exclusive_promotions: store.exclusivePromotions,
          captcha: JSON.stringify({
            jwtToken: '',
            clientText: captcha,
          }),
        };

        // the endpoint is throwing an error while trying to decode the token
        await apiService.post('api/v1/register', params, {
          Cookie: `captcha_bypass=${token}`,
        });

        await apiService.clearCookies();
        await delay(100);
        if (featuresService.has('onboarding-october-2020')) {
          sessionService.setInitialScreen('SelectHashtags');
        }
        try {
          await authService.login(store.username, store.password);
          i18n.setLocaleBackend();
        } catch (err) {
          try {
            await authService.login(store.username, store.password);
          } catch (error) {
            showNotification(i18n.t('auth.failedToLoginNewAccount'));
            logService.exception(error);
          }
        }
      } catch (err) {
        showNotification(err.message, 'warning', 3000, 'top');
        logService.exception(err);
      } finally {
        store.inProgress = false;
      }
    },
    onRegisterPress() {
      this.showErrors = true;
      if (!store.termsAccepted) {
        return showNotification(
          i18n.t('auth.termsAcceptedError'),
          'info',
          3000,
          'top',
        );
      }
      if (!validatePassword(store.password).all) {
        showNotification(
          i18n.t('auth.invalidPassword'),
          'warning',
          2000,
          'top',
        );
        return;
      }
      if (
        !store.username ||
        !store.email ||
        !validatorService.email(store.email)
      ) {
        return;
      }
      this.onCaptchResult();
    },
    focus() {
      this.focused = true;
    },
    blur() {
      this.focused = false;
    },
    setPassword(value: string) {
      store.showErrors = false;
      store.password = value;
    },
    setUsername(value: string) {
      store.showErrors = false;
      store.username = value;
      if (!store.username.match(alphanumericPattern)) {
        store.showErrors = true;
      }
    },
    setEmail(value: string) {
      store.showErrors = false;
      store.email = value;
    },
    toggleTerms() {
      store.termsAccepted = !store.termsAccepted;
    },
    toggleHidePassword() {
      store.hidePassword = !store.hidePassword;
    },
    togglePromotions() {
      store.exclusivePromotions = !store.exclusivePromotions;
    },
    emailInputBlur() {
      store.email = store.email.trim();
      if (!validatorService.email(store.email)) {
        this.showErrors = true;
      }
    },
    get usernameError() {
      return !this.showErrors
        ? undefined
        : !this.username
        ? i18n.t('auth.fieldRequired')
        : !this.username.match(alphanumericPattern)
        ? i18n.t('auth.matchPattern')
        : undefined;
    },
  }));

  const theme = ThemedStyles.style;

  const inputs = (
    <View style={styles.shadow}>
      <InputContainer
        containerStyle={styles.inputBackground}
        style={theme.colorWhite}
        labelStyle={theme.colorWhite}
        placeholder={i18n.t('auth.username')}
        onChangeText={store.setUsername}
        value={store.username}
        testID="usernameInput"
        error={store.usernameError}
        noBottomBorder
        autofocus
      />
      <InputContainer
        containerStyle={styles.inputBackground}
        style={theme.colorWhite}
        labelStyle={theme.colorWhite}
        placeholder={i18n.t('auth.email')}
        onChangeText={store.setEmail}
        value={store.email}
        testID="emailInput"
        error={
          !store.showErrors
            ? undefined
            : !store.email
            ? i18n.t('auth.fieldRequired')
            : !validatorService.email(store.email)
            ? validatorService.emailMessage(store.email)
            : undefined
        }
        noBottomBorder
        onBlur={store.emailInputBlur}
      />
      <View>
        <PasswordInput
          store={store}
          tooltipBackground={DARK_THEME.TertiaryBackground}
          inputContainerStyle={styles.inputBackground}
          inputStyle={theme.colorWhite}
          inputLabelStyle={theme.colorWhite}
          iconStyle={[theme.inputIcon, icon, theme.colorWhite]}
        />
      </View>
    </View>
  );

  const setting = {
    ...shadowOptLocal,
    style: {},
  };

  const inputsWithShadow = Platform.select({
    ios: inputs,
    android: <BoxShadow setting={setting}>{inputs}</BoxShadow>, // Android fallback for shadows
  });

  return (
    <DismissKeyboard>
      <SafeAreaView style={theme.flexContainer}>
        <KeyboardAvoidingView behavior="height">
          <FitScrollView>
            <View style={[theme.rowJustifyStart, theme.paddingVertical3x]}>
              <Text
                style={[
                  theme.titleText,
                  theme.textCenter,
                  theme.colorWhite,
                  theme.paddingVertical3x,
                  theme.positionAbsolute,
                ]}>
                {i18n.t('auth.createChannel')}
              </Text>
              <Icon
                size={34}
                name="ios-chevron-back"
                style={[theme.colorWhite, theme.padding]}
                onPress={props.navigation.goBack}
              />
            </View>
            {inputsWithShadow}
            <View style={[theme.paddingHorizontal4x, theme.paddingVertical2x]}>
              <CheckBox
                containerStyle={[
                  theme.checkbox,
                  theme.paddingLeft,
                  theme.margin0x,
                  theme.paddingBottom0x,
                ]}
                title={
                  <Text
                    style={[
                      theme.colorWhite,
                      theme.fontL,
                      theme.paddingLeft2x,
                    ]}>
                    {i18n.t('auth.accept')}{' '}
                    <Text
                      style={theme.link}
                      onPress={() =>
                        Linking.openURL('https://www.minds.com/p/terms')
                      }>
                      {i18n.t('auth.termsAndConditions')}
                    </Text>
                  </Text>
                }
                checked={store.termsAccepted}
                onPress={store.toggleTerms}
              />
              <CheckBox
                containerStyle={[
                  theme.checkbox,
                  theme.paddingLeft,
                  theme.margin0x,
                  // theme.padding0x,
                ]}
                title={
                  <Text
                    style={[
                      theme.colorWhite,
                      theme.fontL,
                      theme.paddingLeft2x,
                    ]}>
                    {i18n.t('auth.promotions')}
                  </Text>
                }
                checked={store.exclusivePromotions}
                onPress={store.togglePromotions}
              />
              <Button
                onPress={store.onRegisterPress}
                text={i18n.t('auth.createChannel')}
                containerStyle={[theme.fullWidth, theme.marginTop]}
                loading={store.inProgress}
                disabled={store.inProgress}
                testID="registerButton"
                large
                transparent
              />
            </View>
          </FitScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </DismissKeyboard>
  );
});
