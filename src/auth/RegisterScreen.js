import React, {
  Component
} from 'react';

import { NavigationActions } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import Video from "react-native-video";

import {
  Text,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image,
  Platform,
  Animated,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import RegisterForm from './RegisterForm';
import VideoBackground from '../common/components/VideoBackground';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

export default class Register extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={CommonStyle.flexContainer}>
        <VideoBackground />
        <KeyboardAvoidingView style={[CommonStyle.flexContainerCenter, CommonStyle.padding2x]} behavior={ Platform.OS == 'ios' ? 'padding' : 'height' }>
          <Animatable.View animation="bounceIn">
            <Animated.View>
                <RegisterForm
                  onRegister={this.onRegister}
                  onBack={this.onPressBack}
                />
            </Animated.View>
          </Animatable.View>
        </KeyboardAvoidingView>
    </View>
    );
  }

  onPressBack = () => {
    this._navigate('Login');
  }

  onRegister = guid => {
    // TODO: Fixme, Channel seems to be available after navigation
    // this._navigate('Tabs', { routeName: 'Channel', params: { guid, edit: true } });
    this._navigate('OnboardingScreen');
  }

  /**
   * Navigate to screen
   * @param {string} destination
   * @param {*} childRouterAction
   */
  _navigate(destination, childRouterAction) {
    const navigateAction = { routeName: destination };

    if (childRouterAction) {
      navigateAction.action = NavigationActions.navigate(childRouterAction);
    }

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate(navigateAction)
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }
}
