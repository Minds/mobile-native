import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from 'react-native';

import { login } from '../auth/LoginService';
import { register } from './RegisterService';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

import { CheckBox } from 'react-native-elements'

/**
 * Register Form
 */
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
      <KeyboardAvoidingView behavior='padding'
        style={styles.container}>
        <View>
          <Text style={{color: '#F00', textAlign: 'center', paddingTop:4, paddingLeft:4}}>
            {this.state.error.termsAcceptedError}
          </Text>
        </View>
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder='Username'
          placeholderTextColor="white"
          returnKeyType={'done'}
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ username: value })}
          value={this.state.username}
        />
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder='Email'
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({ email: value })}
          value={this.state.email}
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
        <TextInput
          style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
          placeholder='Confirm Password'
          secureTextEntry={true}
          returnKeyType={'done'}
          placeholderTextColor="white"
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.validatePassword( value )}
          value={this.state.confirmPassword}
        />
        <View>
          <Text style={{color: '#F00', textAlign: 'center', paddingTop:4, paddingLeft:4}}>
            {this.state.error.confirmPasswordError}
          </Text>
        </View>
        <CheckBox
          iconRight
          containerStyle={styles.checkbox}
          title='I accept the terms and conditions'
          checked={this.state.termsAccepted}
          textStyle={{color:'white'}}
          onPress={() => { this.setState({ termsAccepted: !this.state.termsAccepted})}}
        />
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.marginTop2x]}>
          <View style={ComponentsStyle.loginButton}>
            <Button
              onPress={() => this.onPressBack()}
              title="Go Back"
              color="rgba(0,0,0, 0.5)"
            />
          </View>
          <View style={ComponentsStyle.loginButton}>
            <Button
              onPress={() => this.onPressRegister()}
              title="Create channel"
              color="rgba(0,0,0, 0.5)"
            />
          </View>
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
              this.props.onRegister();
            })
            .catch(err => {
              alert(err);
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

const styles = StyleSheet.create({
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignSelf:'flex-end'
  }
});