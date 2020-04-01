//@ts-nocheck
import React, { PureComponent } from 'react';

import { View, Text, SafeAreaView } from 'react-native';

import authService from './AuthService';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import Button from '../common/components/Button';
import Input from '../common/components/Input';
import ThemedStyles from '../styles/ThemedStyles';

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
      msg: i18n.t('auth.requestNewPassword'),
    });
  }

  /**
   * Render
   */
  render() {
    const CS = ThemedStyles.style;
    return (
      <SafeAreaView style={CS.flexContainer}>
        <Text
          style={[
            CS.titleText,
            CS.colorPrimaryText,
            CS.marginTop3x,
            CS.marginBottom3x,
          ]}>
          {i18n.t('auth.forgot')}
        </Text>
        <Text
          style={[
            CS.subTitleText,
            CS.colorPrimaryText,
            CS.marginTop1x,
            CS.marginBottom3x,
          ]}>
          {this.state.msg}
        </Text>
        {!this.state.sent && <Input
          placeholder={i18n.t('auth.username')}
          returnKeyType={'done'}
          onChangeText={(value) => this.setState({ username: value })}
          autoCapitalize={'none'}
          value={this.state.username}
        />}
        <View style={[CS.rowJustifyEnd, CS.marginTop4x]}>
          <Button
            onPress={() => this.onPressBack()}
            text={i18n.t('goback')}
            containerStyle={[CS.button, CS.marginRight2x]}
            textStyle={CS.buttonText}
          />
          {!this.state.sent && <Button
            onPress={() => this.onContinuePress()}
            text={i18n.t('continue')}
            loading={this.state.sending}
            loadingRight={true}
            disable={this.state.sending || this.state.sent}
            containerStyle={CS.button}
            textStyle={CS.buttonText}
          />}
        </View>
      </SafeAreaView>
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
