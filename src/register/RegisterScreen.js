import React, {
  Component
} from 'react';

import { NavigationActions } from 'react-navigation';
import FastImage from 'react-native-fast-image';

import {
  Text,
  StyleSheet,
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