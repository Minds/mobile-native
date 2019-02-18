import React, {
  PureComponent
} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';

import CookieManager from 'react-native-cookies';

import authService from './AuthService';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

import { Button } from 'react-native-elements'

import i18n from '../common/services/i18n.service';
import navigation from '../navigation/NavigationService';
import delay from '../common/helpers/delay';

/**
 * Reset Password Form
 */
export default class ResetPassword extends PureComponent {

  /**
   * Component will mount
   */
  componentWillMount() {
    this.setState({
      password: '',
      confirmation: '',
      sending: false,
      sent: false,
      msg: 'Please enter your new password'
    });
  }

  /**
   * Render
   */
  render() {
    return (
      <KeyboardAvoidingView behavior='padding'>
        <Text style={[CS.colorWhite, CS.fontM]}>{this.state.msg}</Text>
        <TextInput
          style={[ComponentsStyle.loginInput, CS.marginTop2x, CS.marginBottom2x]}
          placeholder={i18n.t('auth.password')}
          returnKeyType={'done'}
          placeholderTextColor="#444"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ password: value })}
          autoCapitalize={'none'}
          value={this.state.password}
          secureTextEntry={true}
        />
        <TextInput
          style={[ComponentsStyle.loginInput, CS.marginTop2x, CS.marginBottom2x]}
          placeholder={i18n.t('auth.confirmpassword')}
          returnKeyType={'done'}
          placeholderTextColor="#444"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ confirmation: value })}
          autoCapitalize={'none'}
          value={this.state.confirmation}
          secureTextEntry={true}
        />
        <View style={[CS.rowJustifyEnd, CS.marginTop2x]}>
          <Button
            onPress={this.onPressBack}
            title={i18n.t('goback')}
            backgroundColor="rgba(0,0,0, 0.5)"
            borderRadius={30}
            containerViewStyle={ComponentsStyle.loginButton}
            textStyle={ComponentsStyle.loginButtonText}
          />
          {!this.state.sent && <Button
            onPress={() => this.onContinuePress()}
            title={i18n.t('continue')}
            backgroundColor="rgba(0,0,0, 0.5)"
            hidde={this.state.sent}
            borderRadius={30}
            loading={this.state.sending}
            loadingRight={true}
            disable={this.state.sending || !this.state.password || !this.state.confirmation}
            containerViewStyle={ComponentsStyle.loginButton}
            textStyle={ComponentsStyle.loginButtonText}
          />}
        </View>
      </KeyboardAvoidingView>
    );
  }

  /**
   * On press back
   */
  onPressBack = () =>  {
    navigation.reset('Login');
  }

  /**
   * On continue press
   */
  async onContinuePress() {

    if (this.state.confirmation !== this.state.password) {
      alert('Passwords should match');
      return;
    }

    if (!this.state.sent ) {
      this.setState({sending: true});

      const state = navigation.getCurrentState();

      try {
        const data = await authService.reset(state.params.username, this.state.password, state.params.code);
        // clear the cookies (fix future issues with calls)
        await CookieManager.clearAll();

        if (data.status === 'success') {
          await delay(100);
          authService.login(state.params.username, this.state.password);
        } else {
          throw data;
        }
      } catch (err) {
        if (err.message) {
          alert(err.message);
        } else {
          alert('Oops. Please try again.');
        }
        console.log(err);
      } finally {
        this.setState({ sending: false });
      }
    }
  }

  // reset(password) {
  //   if (!this.error) {
  //     this.client.post('api/v1/forgotpassword/reset', {
  //       password: password.value,
  //       code: this.code,
  //       username: this.username
  //     })
  //       .then((response: any) => {
  //         this.session.login(response.user);
  //         this.router.navigate(['/newsfeed']);
  //       })

  //   }

}