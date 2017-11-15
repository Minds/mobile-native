import React, { Component } from 'react';
import {
  StyleSheet
} from 'react-native';

import { 
  StackNavigator 
} from 'react-navigation';

import LoadingScreen from './src/LoadingScreen';
import LoginScreen from './src/auth/LoginScreen';
import TabsScreen from './src/tabs/TabsScreen';
import NotificationsScreen from './src/notifications/NotificationsScreen';


const Stack = StackNavigator({
  Loading: {
    screen: LoadingScreen,
  },
  Login: { 
    screen: LoginScreen,
  },
  Tabs: {
    screen: TabsScreen,
  },
  Notifications: {
    screen: NotificationsScreen,
  },
});

export default class App extends Component {
  render() {
    return (
      <Stack />
    );
  }
}