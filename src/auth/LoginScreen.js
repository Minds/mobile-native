import React, {
  Component
} from 'react';

import { NavigationActions } from 'react-navigation';
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
import ForgotPassword from './ForgotPassword';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

const LOGO_HEIGHT = 100;
const LOGO_HEIGHT_SMALL = 50;

/**
 * Login screen
 */
export default class LoginScreen extends Component {

  state = {
    forgotPassword: false
  }

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

    let body;

    if (this.state.forgotPassword) {
      body = (
        <ForgotPassword
          onBack={this.onForgotBack}
          onForgotSend={this.onForgotSend}
        />
      );
    } else {
      body = (
        <LoginForm
          onLogin={() => this.login()}
          onRegister={() => this.onPressRegister()}
          onForgot={this.onForgot}
        />
      );
    }

    return (
      <KeyboardAvoidingView style={CommonStyle.flexContainer} behavior={ Platform.OS == 'ios' ? 'padding' : 'none' }>
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
            {body}
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  onForgotBack = () => {
    this.setState({ forgotPassword: false });
  }

  onForgot = () => {
    this.setState({forgotPassword: true});
  }

  /**
   * On press register
   */
  onPressRegister() {
    this._navigate('Register');
  }

  /**
   * On login successful
   */
  login() {
    this._navigate('Loading');
  }

  /**
   * Navigate to screen
   * @param {string} destination
   */
  _navigate(destination) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: destination })
      ]
    })

    this.props.navigation.dispatch(resetAction);
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