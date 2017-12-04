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

import session from './common/services/session.service';

export default class LoadingScreen extends Component {

  static navigationOptions = {
    header: props => <View style={ { backgroundColor: '#FFF' }} />,
  }

  render() {
    return (
      <View style={ { backgroundColor: '#FFF' }}/>
    );
  }

  componentWillMount() {
    session.isLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.goToTabs();
      } else {
        this.goToLogin();
      }
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