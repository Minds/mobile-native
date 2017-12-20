import React, {
  Component
} from 'react';

import { NavigationActions } from 'react-navigation';
import FastImage from 'react-native-fast-image';

import {
  Text,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image
} from 'react-native';

import RegisterForm from './RegisterForm';
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
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          style={ComponentsStyle.backgroundImage}
          source={require('../assets/bg-2.jpg')}
        />
        <View style={[CommonStyle.flexContainerCenter, CommonStyle.padding2x]}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={ComponentsStyle.logo}
            source={require('../assets/logos/medium-white.png')}
          />
          <RegisterForm
            onRegister={() => this.onRegister()}
            onBack={() => this.onPressBack()}
          />

        </View>
    </View>
    );
  }

  onPressBack() {
    this._navigate('Login');
  }

  onRegister() {
    this._navigate('Tabs');
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