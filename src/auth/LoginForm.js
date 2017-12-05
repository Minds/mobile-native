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
} from 'react-native';

import { observer, inject } from 'mobx-react/native';

import { login } from './LoginService';

@inject('user')
@observer
export default class LoginForm extends Component<{}> {

  state = {
    username: 'byte64',
    password: 'temp'
  };

  props: {
    onLogin: () => void
  }

  render() {
    return (  
        <KeyboardAvoidingView behavior='padding'
          style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder='Login'
            returnKeyType={'done'}
            placeholderTextColor="white"
            underlineColorAndroid='transparent'
            onChangeText={(value) => this.setState({ username: value })}
            value={this.state.username}
          />
          <TextInput
            style={styles.input}
            placeholder='password'
            secureTextEntry={true}
            returnKeyType={'done'}
            placeholderTextColor="white"
            underlineColorAndroid='transparent'
            onChangeText={(value) => this.setState({ password: value })}
            value={this.state.password}
          />

          <Button
            onPress={() => this.onLoginPress()}
            title="Login"
            color="rgba(0,0,0, 0.5)"
            style={styles.button}
          />
        </KeyboardAvoidingView>
    );
  }

  onLoginPress() {

    login(this.state.username, this.state.password)
      .then(data => {
        this.props.onLogin();
        this.props.user.load('me');
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
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
  button: {
    backgroundColor:'rgba(0,0,0, 0.3)',
    margin: 15,
  }
});