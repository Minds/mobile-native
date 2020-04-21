//@ts-nocheck
import React, { Component } from 'react';

import {
  Text,
  View,
  ScrollView,
  Linking,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  LayoutAnimation,
} from 'react-native';

import authService from '../auth/AuthService';
import { observer, inject } from 'mobx-react';
import { CheckBox } from 'react-native-elements';

import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import delay from '../common/helpers/delay';
import apiService from '../common/services/api.service';
import Input from '../common/components/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../common/components/Button';
import { DISABLE_PASSWORD_INPUTS } from '../config/Config';
import ThemedStyles from '../styles/ThemedStyles';
import PasswordValidator from '../common/components/PasswordValidator';
import validatePassword from '../common/helpers/validatePassword';

import type { registerParams } from '../auth/AuthService';

/**
 * Register Form
 */
@inject('user')
@observer
class RegisterForm extends Component {
  state = {
    error: {},
    password: '',
    passwordFocused: false,
    username: '',
    confirmPassword: '',
    email: '',
    termsAccepted: false,
    exclusive_promotions: false,
    inProgress: false,
  };

  validatePassword(value) {
    let error = this.state.error;
    if (this.state.password !== value) {
      error.confirmPasswordError = i18n.t('auth.confirmPasswordError');
    } else {
      error.confirmPasswordError = '';
    }

    error.invalidPasswordError = !validatePassword(value).all
      ? i18n.t('auth.invalidPassword')
      : '';

    this.setState({ error });
  }

  validateTerms(value) {
    let error = this.state.error;
    if (!this.state.termsAccepted && this.state.username.length > 4) {
      error.termsAcceptedError = i18n.t('auth.termsAcceptedError');
    } else {
      error.termsAcceptedError = '';
    }
    this.setState({ termsAccepted: !!value, error });
  }

  setUsername = (username) => this.setState({ username });
  setEmail = (email) => this.setState({ email });
  setPassword = (password) => this.setState({ password });
  setConfirmPassword = (confirmPassword) => this.setState({ confirmPassword });

  getFormBody = () => {
    const CS = ThemedStyles.style;
    return (
      <ScrollView
        style={[CS.flexContainer, CS.marginTop2x]}
        contentContainerStyle={[CS.paddingHorizontal4x, CS.paddingBottom5x]}>
        <SafeAreaView style={CS.flexContainer}>
          <TouchableOpacity
            onPress={this.props.onBack}
            style={CS.marginBottom3x}>
            <Icon
              size={34}
              name="keyboard-arrow-left"
              style={CS.colorSecondaryText}
            />
          </TouchableOpacity>
          <Text
            style={[
              CS.marginBottom3x,
              CS.textCenter,
              CS.titleText,
              CS.colorPrimaryText,
            ]}>
            {i18n.t('auth.join')}
          </Text>
          <Text style={[CS.colorAlert, CS.textCenter]}>
            {this.state.error.termsAcceptedError}
          </Text>
          {this.state.passwordFocused ? (
            <PasswordValidator password={this.state.password} />
          ) : (
            <>
              <Input
                style={CS.marginBottom2x}
                placeholder={i18n.t('auth.username')}
                onChangeText={this.setUsername}
                value={this.state.username}
                editable={!this.state.inProgress}
                testID="registerUsernameInput"
              />
              <Input
                style={CS.marginBottom2x}
                placeholder={i18n.t('auth.email')}
                onChangeText={this.setEmail}
                value={this.state.email}
                editable={!this.state.inProgress}
                testID="registerEmailInput"
              />
            </>
          )}

          <Input
            style={CS.marginBottom2x}
            placeholder={i18n.t('auth.password')}
            secureTextEntry={!DISABLE_PASSWORD_INPUTS} // e2e workaround
            onChangeText={this.setPassword}
            value={this.state.password}
            editable={!this.state.inProgress}
            onFocus={this.focusPassword}
            onBlur={this.blurPassword}
            testID="registerPasswordInput"
          />
          <Input
            placeholder={i18n.t('auth.confirmpassword')}
            secureTextEntry={!DISABLE_PASSWORD_INPUTS} // e2e workaround
            onChangeText={this.setConfirmPassword}
            value={this.state.confirmPassword}
            editable={!this.state.inProgress && this.state.password}
            testID="registerPasswordConfirmInput"
          />
          <CheckBox
            containerStyle={CS.checkbox}
            title={
              <Text style={[CS.colorSecondaryText, CS.fontL]}>
                {i18n.t('auth.accept')}{' '}
                <Text
                  style={CS.link}
                  onPress={() =>
                    Linking.openURL('https://www.minds.com/p/terms')
                  }>
                  {i18n.t('auth.termsAndConditions')}
                </Text>
              </Text>
            }
            checked={this.state.termsAccepted}
            onPress={this.check}
            disabled={this.state.inProgress}
            testID="checkbox"
          />

          <View style={(CS.flexContainer, CS.paddingTop2x)}>
            <Button
              onPress={() => this.onPressRegister()}
              borderRadius={2}
              containerStyle={[CS.button, CS.fullWidth]}
              textStyle={CS.buttonText}
              loading={this.state.inProgress}
              loadingRight={true}
              disabled={this.state.inProgress}
              text={i18n.t('auth.createChannel')}
              testID="registerCreateButton"
            />
            <Text
              style={[
                CS.subTitleText,
                CS.colorSecondaryText,
                CS.centered,
                CS.marginTop2x,
              ]}>
              {i18n.to('auth.alreadyHaveAccount', null, {
                login: (
                  <Text style={[CS.link, CS.fontL]} onPress={this.props.onBack}>
                    {i18n.t('auth.login')}
                  </Text>
                ),
              })}
            </Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };

  check = () => {
    this.setState({ termsAccepted: !this.state.termsAccepted });
  };

  render() {
    const CS = ThemedStyles.style;
    return (
      <View style={[CS.flexContainerCenter, CS.backgroundPrimary]}>
        {this.getFormBody()}
      </View>
    );
  }

  focusPassword = () => {
    this.setState({ passwordFocused: true });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  blurPassword = () => {
    this.setState({ passwordFocused: false });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  /**
   * On press register
   */
  async onPressRegister() {
    this.validatePassword(this.state.confirmPassword);

    if (!this.state.termsAccepted) {
      return Alert.alert(i18n.t('ops'), i18n.t('auth.termsAcceptedError'));
    }

    if (this.state.error.confirmPasswordError) {
      return Alert.alert(i18n.t('ops'), this.state.error.confirmPasswordError);
    }

    if (this.state.error.invalidPasswordError) {
      return Alert.alert(i18n.t('ops'), this.state.error.invalidPasswordError);
    }

    this.setState({ inProgress: true });

    try {
      const params = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        exclusive_promotions: this.state.exclusive_promotions,
      } as registerParams;
      await authService.register(params);
      sessionService.setInitialScreen('OnboardingScreen');
      await apiService.clearCookies();
      await delay(100);
      await authService.login(this.state.username, this.state.password);
    } catch (err) {
      Alert.alert(i18n.t('ops'), err.message);
    }

    this.setState({ inProgress: false });
  }
}

export default RegisterForm;
