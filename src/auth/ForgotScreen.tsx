//@ts-nocheck
import React, { Component } from 'react';

import { View, KeyboardAvoidingView, Platform } from 'react-native';

import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ThemedStyles from '../styles/ThemedStyles';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';

type ForgotScreenRouteProp = RouteProp<AuthStackParamList, 'Forgot'>;
type ForgotScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Forgot'
>;

type PropsType = {
  navigation: ForgotScreenNavigationProp;
  route: ForgotScreenRouteProp;
};

/**
 * Forgot screen
 */
export default class ForgotScreen extends Component<PropsType> {
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
    const code = this.props.route.params && this.props.route.params.code;
    const username =
      this.props.route.params && this.props.route.params.username;
    const theme = ThemedStyles.style;

    return (
      <KeyboardAvoidingView
        style={theme.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={[theme.flexContainer, theme.paddingTop4x]}>
          {code && username ? (
            <ResetPassword
              onBack={this.onForgotBack}
              code={code.replace('code=', '')}
              username={username.replace('username=', '')}
            />
          ) : (
            <ForgotPassword onBack={this.onForgotBack} />
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }

  /**
   * On press back
   */
  onForgotBack = () => {
    this.props.navigation.goBack();
  };
}
