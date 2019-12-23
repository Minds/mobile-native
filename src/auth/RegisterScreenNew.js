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
import TriangleCornerYellow from '../common/components/shapes/TriangleCornerYellow';
import RegisterFormNew from './RegisterFormNew';
import TriangleCorner from '../common/components/shapes/TriangleCorner';
import Rectangle from '../common/components/shapes/Rectangle';

export default class RegisterScreenNew extends Component {

  /**
   * Disable navigation bar
   * 
   */
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <Rectangle>
        <Animatable.View animation="bounceIn">
          <Animated.View>
            <RegisterFormNew
              onRegister={this.onRegister}
              onBack={this.onPressBack}
            />
          </Animated.View>
        </Animatable.View>
      </Rectangle>
    );
  }

  onPressBack = () => {
    this.props.navigation.navigate('Login');
  }

  onRegister = guid => {
    logService.info('[Register] new user registered '+guid);
  }
}


const styles = StyleSheet.create({

});