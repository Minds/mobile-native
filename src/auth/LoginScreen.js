import React, {
  Component
} from 'react';

import { NavigationActions } from 'react-navigation';
import session from '../common/services/session.service';

import {
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Button,
} from 'react-native';

import LoginForm from './LoginForm';

export default class LoginScreen extends Component {
  render() {
    const resizeMode = 'center';
    return (
      <View style={{ flex: 1}}>
      <Image
        style={styles.background}
        source={require('../assets/bg-2.jpg')}/>
        <View
          style={styles.viewWrapper}>
          <Image
            style={styles.stretch}
            source={require('../assets/logos/medium-white.png')}
          />
          <KeyboardAvoidingView
            behavior='padding'
            style={styles.keyboardAvoidingView} 
          >
            <LoginForm
              onLogin={() => this.login()}
            />
            <Button
              onPress={() => this.onPressRegister()}
              title="Create a channel"
              color="rgba(0,0,0, 0.5)"
              accessibilityLabel="Create a channel"
            />
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }

  onPressRegister() {
    const registerAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Register' })
      ]
    })

    this.props.navigation.dispatch(registerAction);
  }

  login() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Tabs' })
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }
}

const styles = StyleSheet.create({
  stretch: {
    width: 200,
    height: 80,
    marginLeft: 20,
    marginTop: 0
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {backgroundColor: 'transparent'}
});