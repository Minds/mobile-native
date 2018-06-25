import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import * as Animatable from 'react-native-animatable';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';

import authService from './AuthService';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

import { Button } from 'react-native-elements'

import i18n from '../common/services/i18n.service';

/**
 * Login Form
 */
export default class LoginForm extends Component {

  state = {
    username: '',
    password: '',
    msg: '',
    twoFactorToken: '',
    twoFactorCode: '',
    inProgress: false
  };

  /**
   * Render
   */
  render() {
    const msg = (this.state.msg) ? <Animatable.Text animation="bounceInLeft" style={[CommonStyle.colorLight, { textAlign: 'center' }]}>{this.state.msg}</Animatable.Text>:null;

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
          <Text style={[CommonStyle.colorWhite, ComponentsStyle.link]} onPress={this.onForgotPress}>FORGOT PASSWORD</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  getButtons() {
    const buttons = [
      <Button
        onPress={() => this.onLoginPress()}
        title={i18n.t('auth.login')}
        borderRadius={3}
        backgroundColor="transparent"
        containerViewStyle={ComponentsStyle.loginButton}
        textStyle={ComponentsStyle.loginButtonText}
        key={1}
        loading={this.state.inProgress}
        loadingRight={true}
        disabled={this.state.inProgress}
        disabledStyle={CommonStyle.backgroundTransparent}
      />
    ]

    if (!this.state.twoFactorToken) {
      buttons.unshift(
        <Button
          onPress={() => this.props.onRegister()}
          title={i18n.t('auth.create')}
          borderRadius={3}
          backgroundColor="transparent"
          containerViewStyle={ComponentsStyle.loginButton}
          textStyle={ComponentsStyle.loginButtonText}
          key={2}
        />
      );
    }

    return buttons;
  }

  getInputs() {
    if (this.state.twoFactorToken) {
      return (
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.code')}
          returnKeyType={'done'}
          placeholderTextColor="#444"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ twoFactorCode: value })}
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
          onChangeText={(value) => this.setState({ username: value })}
          autoCapitalize={'none'}
          value={this.state.username}
          key={1}
        />,
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.password')}
          secureTextEntry={true}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          placeholderTextColor="#444"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password}
          key={2}
        />
      ];
    }
  }

  onForgotPress = () => {
    this.props.onForgot()
  }

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
          console.log(err);
        });
    } else {
      authService.login(this.state.username, this.state.password)
        .then(data => {
          this.props.onLogin();
        })
        .catch(err => {
          err.json()
            .then(errJson => {
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
            })
            .catch(err => {
              this.setState({ msg: 'Unexpected error, please try again.', inProgress: false });
            });
        });
    }
  }
}