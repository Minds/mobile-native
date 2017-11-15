import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';

import { isLoggedIn } from './auth/LoginService';

export default class LoadingScreen extends Component<{}> {

  static navigationOptions = {
    header: props => <View style={ { backgroundColor: '#FFF' }} />,
  }

  render() {
    return (
      <View style={ { backgroundColor: '#FFF' }}/>
    );
  }

  componentWillMount() {
    isLoggedIn()
      .then(() => {
        this.goToTabs();
      })
      .catch(() => {
        this.goToLogin();
      });
  }

  goToTabs() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Tabs' })
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }

  goToLogin() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }
}

const styles = StyleSheet.create({
  
});