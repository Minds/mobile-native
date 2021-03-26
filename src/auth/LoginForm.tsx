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
import navigationService from '../navigation/NavigationService';
import { TwoFactorStore } from './twoFactorAuth/createTwoFactorStore';

type PropsType = {
  onLogin?: Function;
  onRegisterPress?: () => void;
  onForgot: Function;
  store: TwoFactorStore;
};

type StateType = {
  username: string;
  password: string;
  msg: string;
  twoFactorToken: string;
  twoFactorCode: string;
  hidePassword: boolean;
  inProgress: boolean;
};

const { height } = Dimensions.get('window');

const loginMargin = { marginTop: height / 55 };

/**
 * Login Form
 */
export default class LoginForm extends Component<PropsType, StateType> {
  /**
   * State
   */
  state = {
    username: '',
    password: '',
    msg: '',
    twoFactorToken: '',
    twoFactorCode: '',
    language: '',
    hidePassword: true,
    inProgress: false,
  };

  /**
   * Constructor
   */
  constructor(props: PropsType) {
    super(props);
    this.state.language = i18n.getCurrentLocale();
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;

    const msg = this.state.msg ? (
      <Animatable.Text
        animation="bounceInLeft"
        useNativeDriver
        style={[theme.subTitleText, theme.colorSecondaryText, theme.textCenter]}
        testID="loginMsg">
        {this.state.msg}
      </Animatable.Text>
    ) : null;

    const inputs = (
      <View style={styles.shadow}>
        <InputContainer
          containerStyle={styles.inputBackground}
          labelStyle={theme.colorWhite}
          style={theme.colorWhite}
          placeholder={i18n.t('auth.username')}
          onChangeText={this.setUsername}
          autoCompleteType="username"
          textContentType="username"
          value={this.state.username}
          testID="usernameInput"
          noBottomBorder
        />
        <View>
          <InputContainer
            containerStyle={styles.inputBackground}
            labelStyle={theme.colorWhite}
            style={theme.colorWhite}
            placeholder={i18n.t('auth.password')}
            secureTextEntry={this.state.hidePassword}
            autoCompleteType="password"
            textContentType="password"
            onChangeText={this.setPassword}
            value={this.state.password}
            testID="userPasswordInput"
          />
          <Icon
            name={this.state.hidePassword ? 'md-eye' : 'md-eye-off'}
            size={25}
            onPress={this.toggleHidePassword}
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
            onPress={() => this.onLoginPress()}
            text={i18n.t('auth.login')}
            containerStyle={[loginMargin, theme.fullWidth]}
            loading={this.state.inProgress}
            disabled={this.state.inProgress}
            accessibilityLabel="loginButton"
            transparent
            large
          />
          <View style={theme.marginTop4x}>
            <Text
              style={[theme.colorWhite, theme.fontL, theme.textCenter]}
              onPress={this.onForgotPress}>
              {i18n.t('auth.forgot')}
            </Text>
          </View>
          <View style={theme.flexContainer} />
          <Button
            onPress={this.props.onRegisterPress}
            text={i18n.t('auth.createChannel')}
            containerStyle={[theme.fullWidth, theme.marginTop6x]}
            disabled={this.state.inProgress}
            testID="registerButton"
            transparent
            large
          />
        </View>
      </View>
    );
  }

  /**
   * Set username
   * @param {string} value
   */
  setUsername = (value) => {
    const username = String(value).trim();
    this.setState({ username });
  };

  /**
   * Set pasword
   * @param {string} value
   */
  setPassword = (value) => {
    const password = String(value).trim();
    this.setState({ password });
  };

  /**
   * toggle
   * @param {string} value
   */
  toggleHidePassword = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };

  /**
   * Handle forgot password
   */
  onForgotPress = () => {
    this.props.onForgot();
  };

  /**
   * On login press
   */
  onLoginPress() {
    this.setState({ msg: '', inProgress: true });
    // is two factor auth
    authService
      .login(this.state.username, this.state.password)
      .then(() => {
        this.props.onLogin && this.props.onLogin();
      })
      .catch((errJson) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        if (
          errJson.error === 'invalid_grant' ||
          errJson.error === 'invalid_client'
        ) {
          this.setState({
            msg: i18n.t('auth.invalidGrant'),
            inProgress: false,
          });
          return;
        }

        if (errJson.errId && errJson.errId === TWO_FACTOR_ERROR) {
          this.props.store.showTwoFactorForm(
            errJson.headers.map['x-minds-sms-2fa-key'],
            this.state.username,
            this.state.password,
          );
          return;
        }

        this.setState({
          msg: errJson.message || 'Unknown error',
          inProgress: false,
        });

        logService.exception('[LoginForm]', errJson);
      });
  }
}
