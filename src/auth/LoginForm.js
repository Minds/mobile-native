import React, {
  Component
} from 'react';

import * as Animatable from 'react-native-animatable';

import {
  View,
  Text,
  // TextInput,
  KeyboardAvoidingView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import authService from './AuthService';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

import { Button } from 'react-native-elements'

import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import ModalPicker from '../common/components/ModalPicker';

// workaround for android copy/paste issue
import TextInput from '../common/components/TextInput';

/**
 * Login Form
 */
export default class LoginForm extends Component {
  /**
   * State
   */
  state = {
    username: '',
    password: '',
    msg: '',
    twoFactorToken: '',
    twoFactorCode: '',
    hidePassword: true,
    inProgress: false,
    showLanguages: false,
  };

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.state.language = i18n.getCurrentLocale();
  }

  /**
   * Render
   */
  render() {
    const msg = this.state.msg ? (
      <Animatable.Text animation="bounceInLeft" style={[CommonStyle.colorLight, { textAlign: 'center' }]} testID="loginMsg">{this.state.msg}</Animatable.Text>
    ) : null;

    const inputs = this.getInputs();
    const buttons = this.getButtons();

    return (
      <KeyboardAvoidingView behavior='padding'>
        {msg}
        {inputs}
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.marginTop2x]}>
          {buttons}
        </View>
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.paddingTop3x]}>
          <Text style={[CommonStyle.colorWhite, ComponentsStyle.link]} onPress={this.onForgotPress}>{i18n.t('auth.forgot')}</Text>
        </View>
        <View style={[CommonStyle.rowJustifyCenter, CommonStyle.paddingTop3x, CommonStyle.marginTop4x]}>
          <Icon name="md-flag" size={18} color="white" style={{paddingTop:1}}/>
          <Text style={[CommonStyle.colorWhite]} onPress={this.showLanguages}>  {i18n.getCurrentLanguageName()}</Text>
        </View>
        <ModalPicker
          onSelect={this.languageSelected}
          onCancel={this.cancel}
          show={this.state.showLanguages}
          title={i18n.t('language')}
          valueField="value"
          labelField="name"
          value={this.state.language}
          items={i18n.getSupportedLocales()}
        />
      </KeyboardAvoidingView>
    );
  }

  /**
   * Show languages
   */
  showLanguages = () => {
    this.setState({showLanguages: true});
  };

  /**
   * Language selected
   */
  languageSelected = (language) => {
    this.setState({language, showLanguages: false});
    i18n.setLocale(language);
  };

  /**
   * Cancel language selection
   */
  cancel = () => {
    this.setState({showLanguages: false});
  };

  /**
   * Returns the buttons
   */
  getButtons() {
    const buttons = [
      <Button
        onPress={() => this.onLoginPress()}
        title={i18n.t('auth.login')}
        type="clear"
        containerStyle={ComponentsStyle.loginButton}
        titleStyle={ComponentsStyle.loginButtonText}
        key={1}
        loading={this.state.inProgress}
        loadingRight={true}
        disabled={this.state.inProgress}
        disabledStyle={CommonStyle.backgroundTransparent}
        testID="loginButton"
      />
    ];

    if (!this.state.twoFactorToken) {
      buttons.unshift(
        <Button
          onPress={() => this.props.onRegister()}
          title={i18n.t('auth.create')}
          type="clear"
          containerStyle={ComponentsStyle.loginButton}
          titleStyle={ComponentsStyle.loginButtonText}
          key={2}
          testID="registerButton"
        />
      );
    }

    return buttons;
  }

  /**
   * Return the inputs for the form
   */
  getInputs() {
    if (this.state.twoFactorToken) {
      return (
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.code')}
          returnKeyType={'done'}
          placeholderTextColor="#444"
          underlineColorAndroid='transparent'
          onChangeText={this.setTwoFactor}
          autoCapitalize={'none'}
          value={this.state.twoFactorCode}
        />
      );
    } else {
      return [
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.username')}
          returnKeyType={'done'}
          placeholderTextColor="#444"
          underlineColorAndroid='transparent'
          onChangeText={this.setUsername}
          autoCapitalize={'none'}
          value={this.state.username}
          key={1}
          testID="usernameInput"
        />,
        <View key={2}>
          <TextInput
            style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
            placeholder={i18n.t('auth.password')}
            secureTextEntry={this.state.hidePassword}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            placeholderTextColor="#444"
            underlineColorAndroid='transparent'
            onChangeText={this.setPassword}
            value={this.state.password}
            testID="userPasswordInput"
          />
          <Icon
            name={this.state.hidePassword ? 'md-eye' : 'md-eye-off'}
            size={25}
            style={ComponentsStyle.loginInputIcon}
            onPress={this.toggleHidePassword}
          />
        </View>
      ];
    }
  }

  /**
   * Set two factor
   * @param {string} value
   */
  setTwoFactor = value => {
    const twoFactorCode = String(value).trim();
    this.setState({twoFactorCode});
  };

  /**
   * Set two factor
   * @param {string} value
   */
  setUsername = value => {
    const username = String(value).trim();
    this.setState({username});
  };

  /**
   * Set two factor
   * @param {string} value
   */
  setPassword = value => {
    const password = String(value).trim();
    this.setState({password});
  };

  /**
   * Set two factor
   * @param {string} value
   */
  toggleHidePassword = () => {
    this.setState({hidePassword: !this.state.hidePassword});
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
    this.setState({ msg: '', inProgress: true});
    // is two factor auth
    if (this.state.twoFactorToken) {
      authService.twoFactorAuth(this.state.twoFactorToken, this.state.twoFactorCode)
        .then(data => {
          this.props.onLogin();
        })
        .catch(err => {
          logService.exception('[LoginForm]', err);
        });
    } else {
      authService.login(this.state.username, this.state.password)
        .then(data => {
          this.props.onLogin();
        })
        .catch(errJson => {
          if (errJson.error === 'invalid_grant' || errJson.error === 'invalid_client') {
            this.setState({ msg: i18n.t('auth.invalidGrant'), inProgress: false });
            return;
          }

          //TODO implement on backend and edit
          if (errJson.error === 'two_factor') {
            this.setState({ twoFactorToken: errJson.message, inProgress: false });
            return;
          }

          this.setState({ msg: errJson.message || 'Unknown error', inProgress: false });
        });
    }
  }
}
