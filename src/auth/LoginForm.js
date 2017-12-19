import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';

import { login } from './LoginService';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

/**
 * Login Form
 */
export default class LoginForm extends Component {

  state = {
    username: 'byte64',
    password: 'temp'
  };

  /**
   * Render
   */
  render() {
    return (
      <KeyboardAvoidingView behavior='padding'>
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder='Login'
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ username: value })}
          value={this.state.username}
        />
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder='password'
          secureTextEntry={true}
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password}
        />
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.marginTop2x]}>
          <View style={ComponentsStyle.loginButton}>
            <Button
              onPress={() => this.props.onRegister()}
              title="Create a channel"
              color="rgba(0,0,0, 0.5)"
              accessibilityLabel="Create a channel"

            />
          </View>
          <View style={ComponentsStyle.loginButton}>
            <Button
              onPress={() => this.onLoginPress()}
              title="Login"
              color="rgba(0,0,0, 0.5)"

            />
          </View>
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