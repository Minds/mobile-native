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

import authService from './AuthService';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

import { Button } from 'react-native-elements'

import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';

/**
 * Forgot Password Form
 */
export default class ForgotPassword extends PureComponent {

  /**
   * Component will mount
   */
  componentWillMount() {
    this.setState({
      username: '',
      sending: false,
      sent: false,
      msg: i18n.t('auth.requestNewPassword')
    });
  }

  /**
   * Render
   */
  render() {
    return (
      <KeyboardAvoidingView behavior='padding'>
        <Text style={[CommonStyle.colorWhite, CommonStyle.fontM]}>{this.state.msg}</Text>
        {!this.state.sent && <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.username')}
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ username: value })}
          autoCapitalize={'none'}
          value={this.state.username}
        />}
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.marginTop2x]}>
          <Button
            onPress={() => this.onPressBack()}
            title={i18n.t('goback')}
            type="clear"
            containerStyle={ComponentsStyle.loginButton}
            titleStyle={ComponentsStyle.loginButtonText}
          />
          {!this.state.sent && <Button
            onPress={() => this.onContinuePress()}
            title={i18n.t('continue').toUpperCase()}
            backgroundColor="rgba(0,0,0, 0.5)"
            hidde={this.state.sent}
            loading={this.state.sending}
            loadingRight={true}
            disable={this.state.sending}
            type="clear"
            containerStyle={ComponentsStyle.loginButton}
            titleStyle={ComponentsStyle.loginButtonText}
          />}
        </View>
      </KeyboardAvoidingView>
    );
  }

  /**
   * On press back
   */
  onPressBack() {
    this.props.onBack();
  }

  /**
   * On continue press
   */
  async onContinuePress() {

    if (!this.state.sent ) {
      this.setState({sending: true});

      try {
        const data = await authService.forgot(this.state.username);
        this.setState({ sent: true, msg: i18n.t('auth.requestNewPasswordSuccess') });
      } catch (err) {
        alert('Oops. Please try again.');
        logService.exception('[ForgotPassword]', err);
      } finally {
        this.setState({ sending: false });
      }
    }
  }
}