import React, {
  Component
} from 'react';

import { StackActions, NavigationActions } from 'react-navigation';
import FastImage from 'react-native-fast-image';

import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import VideoBackground from '../common/components/VideoBackground';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

const LOGO_HEIGHT = 100;
const LOGO_HEIGHT_SMALL = 50;

/**
 * Forgot screen
 */
export default class ForgotScreen extends Component {

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
    const code = this.props.navigation.state.params && this.props.navigation.state.params.code;
    console.log(this.props.navigation.state)
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
            {code ? <ResetPassword
              onBack={this.onForgotBack}
            /> :
            <ForgotPassword
              onBack={this.onForgotBack}
            />}
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  /**
   * On press back
   */
  onForgotBack = () => {
    this.props.navigation.goBack();
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