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
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import RegisterForm from './RegisterForm';
import VideoBackground from '../common/components/VideoBackground';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import logService from '../common/services/log.service';

export default class Register extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={[CommonStyle.flexContainerCenter, CommonStyle.padding2x]}>
          <VideoBackground />
          <Animatable.View animation="bounceIn">
            <Animated.View>
                <RegisterForm
                  onRegister={this.onRegister}
                  onBack={this.onPressBack}
                />
            </Animated.View>
          </Animatable.View>
      </View>
    );
  }

  onPressBack = () => {
    this.props.navigation.navigate('Login');
  }

  onRegister = guid => {
    logService.info('[Register] new user registered '+guid);
  }
}
