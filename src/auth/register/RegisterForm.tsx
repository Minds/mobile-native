import React, { useRef } from 'react';
import { View, Platform, Linking } from 'react-native';

import { observer, useLocalStore } from 'mobx-react';
import { CheckBox } from 'react-native-elements';

import InputContainer from '../../common/components/InputContainer';
import { styles, shadowOpt, icon } from '../styles';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoxShadow from '../../common/components/BoxShadow';
import Button from '../../common/components/Button';
import { DARK_THEME } from '../../styles/Colors';
import validatePassword from '../../common/helpers/validatePassword';
import { showNotification } from '../../../AppMessages';
import validatorService from '../../common/services/validator.service';
import Captcha from '../../common/components/Captcha';
import authService, { registerParams } from '../AuthService';
import apiService from '../../common/services/api.service';
import delay from '../../common/helpers/delay';
import logService from '../../common/services/log.service';
import sessionService from '../../common/services/session.service';
import featuresService from '../../common/services/features.service';
import PasswordInput from '../../common/components/password-input/PasswordInput';
import MText from '../../common/components/MText';

type PropsType = {};

const shadowOptLocal = Object.assign({}, shadowOpt);
shadowOptLocal.height = 300;

const alphanumericPattern = '^[a-zA-Z0-9_]+$';

const RegisterForm = observer(({}: PropsType) => {
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
    <>
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
            <MText style={[theme.colorWhite, theme.fontL, theme.paddingLeft2x]}>
              {i18n.t('auth.accept')}{' '}
              <MText
                style={theme.link}
                onPress={() =>
                  Linking.openURL('https://www.minds.com/p/terms')
                }>
                {i18n.t('auth.termsAndConditions')}
              </MText>
            </MText>
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
            <MText style={[theme.colorWhite, theme.fontL, theme.paddingLeft2x]}>
              {i18n.t('auth.promotions')}
            </MText>
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
      <Captcha
        ref={captchaRef}
        onResult={store.onCaptchResult}
        testID="captcha"
      />
    </>
  );
});

export default RegisterForm;
