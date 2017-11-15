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

import { login } from './LoginService';

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
            underlineColorAndroid='transparent'
            onChangeText={(value) => this.setState({ username: value })}
            value={this.state.username}
          />
          <TextInput
            style={styles.input}
            placeholder='password'
            secureTextEntry={true}
            returnKeyType={'done'}
            underlineColorAndroid='transparent'
            onChangeText={(value) => this.setState({ password: value })}
            value={this.state.password}
          />

          <Button
            onPress={() => this.onLoginPress()}
            title="Login"
          />
        </KeyboardAvoidingView>
    );
  }

  onLoginPress() {

    login(this.state.username, this.state.password)
      .then(data => {
        this.props.onLogin();
      })
      .catch(err => {
        alert(err);
      });
  }
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 40,
    color: '#333333',
    paddingLeft: 30,
    alignSelf: 'stretch'
  }
});