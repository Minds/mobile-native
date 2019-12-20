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

export default class RegisterScreenNew extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={[CommonStyle.flexContainerCenter, CommonStyle.padding2x, {zIndex:15}]}>
        <TriangleCornerYellow />
        <View style={CommonStyle.flexContainerCenter}>
          <View style={[styles.rectangle, styles.top]} />
          <View style={[styles.rectangle, styles.bottom]}>
            <Animatable.View animation="bounceIn">
              <Animated.View>
                <RegisterFormNew
                  onRegister={this.onRegister}
                  onBack={this.onPressBack}
                />
              </Animated.View>
            </Animatable.View>
          </View>
        </View>
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


const styles = StyleSheet.create({
  rectangle: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: '#FFF',
    zIndex: -5,
    width: '87.5%',
    height: '72.78%',
    transform: [{rotate: '-1deg'}],
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.68,
    elevation: 11,
  },
  top: {},
  bottom: {
    top: 75,
  },
});