import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Text,
  TextInput,
  KeyboardAvoidingView,
  View,
  Linking,
  Alert,
} from 'react-native';

import authService from '../auth/AuthService';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

import { observer, inject } from 'mobx-react/native';

import {
  CheckBox,
  Button
} from 'react-native-elements'

import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';

/**
 * Register Form
 */
@inject('user')
@observer
export default class RegisterForm extends Component {
  state = {
    error: {},
    password: '',
    username: '',
    confirmPassword: '',
    email: '',
    termsAccepted: true,
  };

  validatePassword(value) {
    let error = this.state.error;
    if (this.state.password !== value) {
      error.confirmPasswordError = 'Passwords should match';
    } else {
      error.confirmPasswordError = '';
    }
    this.setState({ error });
  }

  validateTerms(value) {
    let error = this.state.error;
    if(!this.state.termsAccepted && this.state.username.length > 4){
      error.termsAcceptedError = 'You should accept the terms and conditions';
    } else {
      error.termsAcceptedError = '';
    }
    this.setState({ termsAccepted: !!value, error });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior='padding'>
        <View>
          <Text style={{color: '#F00', textAlign: 'center', paddingTop:4, paddingLeft:4}}>
            {this.state.error.termsAcceptedError}
          </Text>
        </View>
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.username')}
          placeholderTextColor="#444"
          returnKeyType={'done'}
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ username: value })}
          value={this.state.username}
        />
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.email')}
          returnKeyType={'done'}
          placeholderTextColor="#444"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ email: value })}
          value={this.state.email}
        />
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder={i18n.t('auth.password')}
          secureTextEntry={true}
          returnKeyType={'done'}
          placeholderTextColor="#444"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password}
        />
        { this.state.password ?
          <TextInput
            style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
            placeholder={i18n.t('auth.confirmpassword')}
            secureTextEntry={true}
            returnKeyType={'done'}
            placeholderTextColor="#444"
            underlineColorAndroid='transparent'
            onChangeText={(value) => this.setState({ confirmPassword: value })}
            value={this.state.confirmPassword}
          /> : null }
        <CheckBox
          iconRight
          containerStyle={ComponentsStyle.registerCheckbox}
          title={<Text style={ComponentsStyle.terms}>I accept the <Text style={ComponentsStyle.link} onPress={ ()=> Linking.openURL('https://www.minds.com/p/terms') }>terms and conditions</Text></Text>}
          checked={this.state.termsAccepted}
          textStyle={ComponentsStyle.registerCheckboxText}
          onPress={() => { this.setState({ termsAccepted: !this.state.termsAccepted})}}
        />
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.marginTop2x]}>
            <Button
              onPress={() => this.onPressBack()}
              title={i18n.t('goback')}
              borderRadius={4}
              backgroundColor="transparent"
              containerViewStyle={ComponentsStyle.loginButton}
              textStyle={ComponentsStyle.loginButtonText}
            />
            <Button
              onPress={() => this.onPressRegister()}
              title={i18n.t('auth.create')}
              backgroundColor="transparent"
              borderRadius={4}
              containerViewStyle={ComponentsStyle.loginButton}
              textStyle={ComponentsStyle.loginButtonText}
            />
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
   * On press register
   */
  async onPressRegister() {
    this.validatePassword(this.state.confirmPassword);

    if (!this.state.termsAccepted) {
      return Alert.alert(
        'Oooopps',
        'Please accept the Terms & Conditions'
      );
    }

    if (this.state.error.confirmPasswordError) {
      return Alert.alert(
        'Oooopps',
        'Please ensure your passwords match'
      );
    }

    try {
      await authService.register(this.state.username ,this.state.email ,this.state.password)
      await authService.login(this.state.username ,this.state.password)
      await this.props.user.load();
      this.props.onRegister(sessionService.guid);
    } catch (err) {
      Alert.alert(
        'Oooopps',
        err.message
      );
    }

  }
}
