//@ts-nocheck
import React, { Component } from 'react';

import { View } from 'react-native';

import RegisterForm from './RegisterForm';
import logService from '../common/services/log.service';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Register screen
 */
export default class RegisterScreen extends Component {
  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null,
  };

  /**
   * Render
   */
  render() {
    return (
      <View style={[ThemedStyles.style.flexContainer]}>
        <RegisterForm onRegister={this.onRegister} onBack={this.onPressBack} />
      </View>
    );
  }

  /**
   * On press back
   */
  onPressBack = () => {
    this.props.navigation.navigate('Login');
  };

  /**
   * On register
   */
  onRegister = (guid) => {
    logService.info('[Register] new user registered ' + guid);
  };
}
