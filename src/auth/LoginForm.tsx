import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';

import {
  View,
  Text,
  LayoutAnimation,
  Dimensions,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import authService, { TWO_FACTOR_ERROR } from './AuthService';

import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import Button from '../common/components/Button';
import ThemedStyles from '../styles/ThemedStyles';
import InputContainer from '../common/components/InputContainer';
import BoxShadow from '../common/components/BoxShadow';
import { styles, shadowOpt, icon } from './styles';
import { TwoFactorStore } from './twoFactorAuth/createTwoFactorStore';
import { observer, useLocalStore } from 'mobx-react';
import ResetPasswordModal, {
  ResetPasswordModalHandles,
} from './reset-password/ResetPasswordModal';
import { LoginScreenRouteProp } from './LoginScreen';

type PropsType = {
  onLogin?: Function;
  onRegisterPress?: () => void;
  store: TwoFactorStore;
  route: LoginScreenRouteProp;
};

const { height } = Dimensions.get('window');

const loginMargin = { marginTop: height / 55 };

export default observer(function LoginForm(props: PropsType) {
  const resetRef = React.useRef<ResetPasswordModalHandles>(null);
  const localStore = useLocalStore(() => ({
    username: '',
    password: '',
    msg: '',
    language: i18n.getCurrentLocale(),
    hidePassword: true,
    inProgress: false,
    setUsername(value) {
      const username = String(value).trim();
      this.username = username;
    },
    setPassword(value) {
      const password = String(value).trim();
      this.password = password;
    },
    toggleHidePassword() {
      this.hidePassword = !this.hidePassword;
    },
    setInProgress(value: boolean) {
      this.inProgress = value;
    },
    initLogin() {
      this.msg = '';
      this.inProgress = true;
    },
    setError(msg: string) {
      this.msg = msg;
      this.inProgress = false;
    },
    onLoginPress() {
      this.initLogin();
      // is two factor auth
      authService
        .login(this.username, this.password)
        .then(() => {
          props.onLogin && props.onLogin();
        })
        .catch(err => {
          const errJson = err.response ? err.response.data : err;
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          if (
            errJson.error === 'invalid_grant' ||
            errJson.error === 'invalid_client'
          ) {
            this.setError(i18n.t('auth.invalidGrant'));
            return;
          }

          if (errJson.errId && errJson.errId === TWO_FACTOR_ERROR) {
            props.store.showTwoFactorForm(
              errJson.headers.map['x-minds-sms-2fa-key'],
              this.username,
              this.password,
            );
            return;
          }

          if (errJson.message.includes('user could not be found')) {
            this.setError(i18n.t('auth.loginFail'));
            return;
          }

          this.setError(errJson.message || 'Unknown error');

          logService.exception('[LoginForm]', errJson);
        });
    },
    onForgotPress() {
      resetRef.current?.show();
    },
  }));

  const username = props.route?.params?.username;
  const code = props.route?.params?.code;
  React.useEffect(() => {
    const navToInputPassword = username && code && !!resetRef.current;
    if (navToInputPassword) {
      resetRef.current!.show(navToInputPassword, username, code);
    }
  }, [code, username]);

  const theme = ThemedStyles.style;

  const msg = localStore.msg ? (
    <Animatable.Text
      animation="bounceInLeft"
      useNativeDriver
      style={[theme.subTitleText, theme.colorSecondaryText, theme.textCenter]}
      testID="loginMsg">
      {localStore.msg}
    </Animatable.Text>
  ) : null;

  const inputs = (
    <View style={styles.shadow}>
      <InputContainer
        containerStyle={styles.inputBackground}
        labelStyle={theme.colorWhite}
        style={theme.colorWhite}
        placeholder={i18n.t('auth.username')}
        onChangeText={localStore.setUsername}
        autoCompleteType="username"
        textContentType="username"
        value={localStore.username}
        testID="usernameInput"
        noBottomBorder
      />
      <View>
        <InputContainer
          containerStyle={styles.inputBackground}
          labelStyle={theme.colorWhite}
          style={theme.colorWhite}
          placeholder={i18n.t('auth.password')}
          secureTextEntry={localStore.hidePassword}
          autoCompleteType="password"
          textContentType="password"
          onChangeText={localStore.setPassword}
          value={localStore.password}
          testID="userPasswordInput"
        />
        <Icon
          name={localStore.hidePassword ? 'md-eye' : 'md-eye-off'}
          size={25}
          onPress={localStore.toggleHidePassword}
          style={[theme.inputIcon, icon]}
        />
      </View>
    </View>
  );

  const inputsWithShadow = Platform.select({
    ios: inputs,
    android: <BoxShadow setting={shadowOpt}>{inputs}</BoxShadow>, // Android fallback for shadows
  });

  return (
    <View style={theme.flexContainer}>
      {msg}
      {inputsWithShadow}
      <View style={[theme.margin6x, theme.flexContainer]}>
        <Button
          onPress={localStore.onLoginPress}
          text={i18n.t('auth.login')}
          containerStyle={[loginMargin, theme.fullWidth]}
          loading={localStore.inProgress}
          disabled={localStore.inProgress}
          accessibilityLabel="loginButton"
          transparent
          large
        />
        <View style={theme.marginTop4x}>
          <Text
            style={[theme.colorWhite, theme.fontL, theme.textCenter]}
            onPress={localStore.onForgotPress}>
            {i18n.t('auth.forgot')}
          </Text>
        </View>
        <View style={theme.flexContainer} />
        <Button
          onPress={props.onRegisterPress}
          text={i18n.t('auth.createChannel')}
          containerStyle={[theme.fullWidth, theme.marginTop6x]}
          disabled={localStore.inProgress}
          testID="registerButton"
          transparent
          large
        />
      </View>
      <ResetPasswordModal ref={resetRef} />
    </View>
  );
});
