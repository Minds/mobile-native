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
  Linking
} from 'react-native';

import { login } from '../auth/LoginService';
import { register } from './RegisterService';
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
    termsAccepted: false,
  };

  validatePassword(value) {
    let error = this.state.error;
    if(this.state.password.length > value.length -2 &&  this.state.password !== value){
      error.confirmPasswordError = 'Passwords should match';
    }else{
      error.confirmPasswordError = '';
    }
    this.setState({ confirmPassword: value, error});
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
            onChangeText={(value) => this.validatePassword( value )}
            value={this.state.confirmPassword}
          /> : null }
        <View>
          <Text style={{color: '#F00', textAlign: 'center', paddingTop:4, paddingLeft:4}}>
            {this.state.error.confirmPasswordError}
          </Text>
        </View>
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
  onPressRegister() {
    if (!this.state.error.termsAcceptedError && !this.state.error.confirmPasswordError) {
      register(this.state.username ,this.state.email ,this.state.password)
        .then(data => {
          login(this.state.username ,this.state.password)
            .then(response => {
              this.props.user.load().then((result) => { 
                this.props.onRegister(sessionService.guid);
              }).catch((err) => {
                alert('Error logging in');
                this.goToLogin();
              });
            })
            .catch(err => {
              alert(JSON.stringify(err));
            });

        })
        .catch(err => {
          alert(err);
        });
    } else {
      alert('Please check the form')
    }
  }
}
