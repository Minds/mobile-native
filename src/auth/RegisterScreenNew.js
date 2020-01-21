import React, {
  Component
} from 'react';

import { StackActions, NavigationActions } from 'react-navigation';
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
  StyleSheet
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import VideoBackground from '../common/components/VideoBackground';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import logService from '../common/services/log.service';
import RegisterFormNew from './RegisterFormNew';

export default class RegisterScreenNew extends Component {

  /**
   * Disable navigation bar
   * 
   */
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Animatable.View animation="bounceIn" style={[CommonStyle.flexContainer]}>
        <Animated.View style={[CommonStyle.flexContainer]}>
          <RegisterFormNew
            onRegister={this.onRegister}
            onBack={this.onPressBack}
          />
        </Animated.View>
      </Animatable.View>
    );
  }

  onPressBack = () => {
    this.props.navigation.navigate('Login');
  };

  onRegister = guid => {
    logService.info('[Register] new user registered '+guid);
  };
}
