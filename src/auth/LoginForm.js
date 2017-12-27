import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';

import { login } from './LoginService';
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
    password: ''
  };

  /**
   * Render
   */
  render() {
    return (
      <KeyboardAvoidingView behavior='padding'>
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.username')}
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ username: value })}
          autoCapitalize={'none'}
          value={this.state.username}
        />
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.password')}
          secureTextEntry={true}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password}
        />
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.marginTop2x]}>
            <Button
              onPress={() => this.props.onRegister()}
              title={i18n.t('auth.create')}
              backgroundColor="rgba(0,0,0, 0.5)"
              borderRadius={4}
              containerViewStyle ={ComponentsStyle.loginButton}
              textStyle={ComponentsStyle.loginButtonText}
              />
            <Button
              onPress={() => this.onLoginPress()}
              title={i18n.t('auth.login')}
              backgroundColor="rgba(0,0,0, 0.5)"
              borderRadius={4}
              containerViewStyle ={ComponentsStyle.loginButton}
              textStyle={ComponentsStyle.loginButtonText}
            />
        </View>
      </KeyboardAvoidingView>
    );
  }

  /**
   * On login press
   */
  onLoginPress() {
    login(this.state.username, this.state.password)
      .then(data => {
        this.props.onLogin();
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
  }
}