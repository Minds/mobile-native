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
import PasswordValidator from '../common/components/PasswordValidator';
import { LIGHT_THEME } from '../styles/Colors';
import Tooltip from '../common/components/Tooltip';
import DismissKeyboard from '../common/components/DismissKeyboard';
import validatePassword from '../common/helpers/validatePassword';
import { showNotification } from '../../AppMessages';
import validatorService from '../common/services/validator.service';
import Captcha from '../common/components/Captcha';
import authService, { registerParams } from './AuthService';
import apiService from '../common/services/api.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';
import FitScrollView from '../common/components/FitScrollView';
import sessionService from '../common/services/session.service';

export type WalletScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

type PropsType = {
  navigation: WalletScreenNavigationProp;
};

const shadowOptLocal = Object.assign({}, shadowOpt);
shadowOptLocal.height = 270;

const validatorText = { color: LIGHT_THEME.primary_text };

export default observer(function RegisterScreen(props: PropsType) {
  const captchaRef = useRef<any>(null);

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
    onCaptchResult: async (captcha: string) => {
      store.inProgress = true;

      captchaRef.current.hide();

      try {
        const params = {
          username: store.username,
          email: store.email,
          password: store.password,
          exclusive_promotions: store.exclusivePromotions,
          captcha,
        } as registerParams;
        await authService.register(params);
        await apiService.clearCookies();
        await delay(100);
        sessionService.setInitialScreen('SelectHashtags');
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
      captchaRef.current?.show();
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
        error={
          store.showErrors && !store.username
            ? i18n.t('auth.fieldRequired')
            : undefined
        }
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
        {!!store.password && store.focused && (
          <Tooltip
            bottom={12}
            backgroundColor={LIGHT_THEME.primary_background}
            containerStyle={theme.paddingLeft2x}>
            <PasswordValidator
              password={store.password}
              textStyle={validatorText}
            />
          </Tooltip>
        )}
        <InputContainer
          containerStyle={styles.inputBackground}
          style={theme.colorWhite}
          labelStyle={theme.colorWhite}
          placeholder={i18n.t('auth.password')}
          secureTextEntry={store.hidePassword}
          onChangeText={store.setPassword}
          value={store.password}
          testID="passwordInput"
          onFocus={store.focus}
          onBlur={store.blur}
        />
        <Icon
          name={store.hidePassword ? 'md-eye' : 'md-eye-off'}
          size={25}
          onPress={store.toggleHidePassword}
          style={[theme.inputIcon, icon, theme.colorWhite]}
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
                containerStyle={[
                  theme.transparentButton,
                  theme.paddingVertical3x,
                  theme.fullWidth,
                  theme.marginTop1x,
                  styles.lightButton,
                ]}
                textStyle={theme.buttonText}
                loading={store.inProgress}
                disabled={store.inProgress}
                testID="registerButton"
              />
            </View>
          </FitScrollView>
        </KeyboardAvoidingView>
        <Captcha
          ref={captchaRef}
          onResult={store.onCaptchResult}
          testID="captcha"
        />
      </SafeAreaView>
    </DismissKeyboard>
  );
});
