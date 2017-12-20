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
          placeholder='Username'
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ username: value })}
          value={this.state.username}
        />
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder='Password'
          secureTextEntry={true}
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password}
        />
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.marginTop2x]}>
            <Button
              onPress={() => this.props.onRegister()}
              title="CREATE A CHANNEL"
              backgroundColor="rgba(0,0,0, 0.5)"
              borderRadius={4}
              containerViewStyle ={ComponentsStyle.loginButton}
              textStyle={ComponentsStyle.loginButtonText}
              />
            <Button
              onPress={() => this.onLoginPress()}
              title="LOGIN"
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