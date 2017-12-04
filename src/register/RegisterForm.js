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
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    View,
    CheckBox,
  } from 'react-native';

  import { login } from '../auth/LoginService';
  import { register } from './RegisterService';

  export default class RegisterForm extends Component<{}> {

    state = {
      error: {},
      password: '',
      username: '',
      confirmPassword: '',
      email: '',
      termsAccepted: false,
    };

    props: {
      onLogin: () => void,
    }

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
              style={styles.input}
              placeholder='Username'
              placeholderTextColor="white"
              returnKeyType={'done'}
              underlineColorAndroid='transparent'
              onChangeText={(value) => this.setState({ username: value })}
              value={this.state.username}
            />
            <TextInput
              style={styles.input}
              placeholder='Email'
              returnKeyType={'done'}
              placeholderTextColor="white"
              underlineColorAndroid='transparent'
              onChangeText={(value) => this.setState({ email: value })}
              value={this.state.email}
            />
            <TextInput
              style={styles.input}
              placeholder='Password'
              secureTextEntry={true}
              returnKeyType={'done'}
              placeholderTextColor="white"
              underlineColorAndroid='transparent'
              onChangeText={(value) => this.setState({ password: value })}
              value={this.state.password}
            />
            <TextInput
              style={styles.input}
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
              style={styles.checkbox}
              title='I accept the terms and conditions'
              value={this.state.termsAccepted}
            />
            <Text style={{position:'absolute', left:55, bottom:60, color: '#FFF', paddingTop:4}}>
              I accept Minds.com terms and conditions.
            </Text>
            <Button
              onPress={() => this.onPressRegister()}
              title="Create channel"
              color="rgba(0,0,0, 0.5)"
            />
          </KeyboardAvoidingView>
      );
    }

    onPressRegister() {
      if (!this.state.error.termsAcceptedError && !this.state.error.confirmPasswordError) {
        register(this.state.username ,this.state.email ,this.state.password)
          .then(data => {
            login(this.state.username ,this.state.password)
              .then(response => {
                this.props.onLogin();
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
    input: {
      color: '#FFF',
      fontSize: 16,
      letterSpacing: 2,
      backgroundColor:'rgba(255,255,255, 0.2)',
      margin: 15,
      height: 40,
      borderRadius: 4,
      opacity: 0.8
    },
    checkbox: {
      margin: 15,
      height: 40,
      backgroundColor:'rgba(255,255,255, 0.2)',
      borderRadius: 4,
      opacity: 0.8
    },
    terms: {

    }
  });