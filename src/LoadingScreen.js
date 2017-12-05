import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import { observer, inject } from 'mobx-react/native';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';

import session from './common/services/session.service';

@inject('user')
@observer
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
        this.props.user.load().then( (result) => {
          this.goToTabs();
        }).catch( (err) => {
          alert('Error logging in');
          this.goToLogin();
        });
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