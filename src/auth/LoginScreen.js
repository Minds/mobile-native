import React, {
  Component
} from 'react';

import { StackActions, NavigationActions } from 'react-navigation';
import FastImage from 'react-native-fast-image';

import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Button,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import LoginForm from './LoginForm';
import VideoBackground from '../common/components/VideoBackground';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import logService from '../common/services/log.service';
import featuresService from '../common/services/features.service';

const LOGO_HEIGHT = 100;
const LOGO_HEIGHT_SMALL = 50;

/**
 * Login screen
 */
export default class LoginScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.logoHeight = new Animated.Value(LOGO_HEIGHT);
  }

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.logoHeight, {
      duration: event.duration,
      toValue: LOGO_HEIGHT_SMALL,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.logoHeight, {
      duration: event.duration,
      toValue: LOGO_HEIGHT,
    }).start();
  };

  /**
   * Render
   */
  render() {
    const resizeMode = 'center';

    return (
      <KeyboardAvoidingView style={CommonStyle.flexContainer} behavior={ Platform.OS == 'ios' ? 'padding' : null }>
        <VideoBackground />
        <View style={[CommonStyle.flexContainerCenter, CommonStyle.padding2x]}>
          <Animatable.View animation="bounceIn">
            <Animated.Image
              resizeMode="contain"
              style={[styles.logo, { height: this.logoHeight }]}
              source={require('../assets/logos/logo-white.png')}
            />
          </Animatable.View>
          <Animatable.View animation="fadeInUp">
            <LoginForm
              onLogin={() => this.login()}
              onRegister={this.onPressRegister}
              onForgot={this.onPressForgot}
            />
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  /**
   * On press forgot
   */
  onPressForgot = () => {
    this.props.navigation.push('Forgot');
  }

  /**
   * On press register
   */
  onPressRegister = () => {
    if (featuresService.has('on-boarding')) {
      this.props.navigation.push('RegisterNew');
    } else {
      this.props.navigation.push('Register');
    }
  }

  /**
   * On login successful
   */
  login() {
    logService.info('user logged in');
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 84,
    marginBottom: 30,
    alignSelf: 'center',
  },
});