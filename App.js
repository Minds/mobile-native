import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react';

import LoadingScreen from './src/LoadingScreen';
import LoginScreen from './src/auth/LoginScreen';
import TabsScreen from './src/tabs/TabsScreen';
import NotificationsScreen from './src/notifications/NotificationsScreen';
import NotificationsSettingsScreen from './src/notifications/NotificationsSettingsScreen';
import ChannelScreen from './src/channel/ChannelScreen';

import newsfeed from './src/stores/NewsfeedStore';
import notifications from './src/notifications/NotificationsStore';
import notificationsSettings from './src/notifications/NotificationsSettingsStore';
import messengerList from './src/messenger/MessengerListStore';
import channel from './src/channel/ChannelStore';

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
  NotificationsSettings: {
    screen: NotificationsSettingsScreen
  },
  Channel: {
    screen: ChannelScreen
  }
});

// Stores
const stores = {
  newsfeed,
  notifications,
  notificationsSettings,
  messengerList,
  channel
}

export default class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <Stack />
      </Provider>
    );
  }
}