import React, {
  Component
} from 'react';

import * as Animatable from 'react-native-animatable';

import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  // TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import authService from './AuthService';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';


import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import ModalPicker from '../common/components/ModalPicker';

// workaround for android copy/paste issue
import TextInput from '../common/components/TextInput';

import Input from '../common/components/Input';

import Button from '../common/components/Button';

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
      <Animatable.Text animation="bounceInLeft" style={[CS.subTitleText, CS.colorSecondaryText, { textAlign: 'center' }]} testID="loginMsg">{this.state.msg}</Animatable.Text>
    ) : null;

    return (
      <View 
        style={[CS.flexContainer]}>
        <ScrollView style={[CS.flexContainer]}>
          <View style={{flex:6}}>
            <Text style={[CS.titleText, CS.colorPrimaryText]}>
              {i18n.t('auth.login')}
            </Text>
            {msg}
            <Input
              placeholder={i18n.t('auth.username')}
              onChangeText={this.setUsername}
              value={this.state.username}
              testID="usernameInput"
            />
            <View>
              <Input
                placeholder={i18n.t('auth.password')}
                secureTextEntry={this.state.hidePassword}
                onChangeText={this.setPassword}
                value={this.state.password}
                testID="userPasswordInput"
              />
              <Icon
                name={this.state.hidePassword ? 'md-eye' : 'md-eye-off'}
                size={25}
                onPress={this.toggleHidePassword}
                style={ComponentsStyle.loginInputIconNew}
              />
            </View>
          </View>
          <View style={[{flex:6, marginTop: 30}]}>
            <Button
              onPress={() => this.onLoginPress()}
              title={i18n.t('auth.login')}
              type="clear"
              containerStyle={ComponentsStyle.loginButtonNew}
              key={1}
              loading={this.state.inProgress}
              loadingRight={true}
              disabled={this.state.inProgress}
              disabledStyle={CS.backgroundTransparent}
              testID="loginButton">
              <Text style={ComponentsStyle.loginButtonTextNew}>{i18n.t('auth.login')}</Text>
            </Button>
            <View style={CS.marginTop4x}>
              <Text style={[ComponentsStyle.linkNew]} onPress={this.onForgotPress}>{i18n.t('auth.forgot')}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
