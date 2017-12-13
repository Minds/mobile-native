import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react';

import LoadingScreen from './src/LoadingScreen';
import LoginScreen from './src/auth/LoginScreen';
import TabsScreen from './src/tabs/TabsScreen';
import NotificationsScreen from './src/notifications/NotificationsScreen';
import NotificationsSettingsScreen from './src/notifications/NotificationsSettingsScreen';
import CommentsScreen from './src/comments/CommentsScreen';
import ChannelScreen from './src/channel/ChannelScreen';
import RegisterScreen from './src/register/RegisterScreen';
import DiscoveryViewScreen from './src/discovery/DiscoveryViewScreen';
import ConversationScreen from './src/messenger/ConversationScreen';
import SettingsScreen from './src/settings/SettingsScreen';
import GroupsListScreen from './src/groups/GroupsListScreen';
import GroupJoinScreen from './src/groups/GroupJoinScreen';
import WalletScreen from './src/wallet/WalletScreen';
import BlogsListScreen from './src/blogs/BlogsListScreen';
import FabScreen from './src/wire/FabScreen';

import newsfeed from './src/newsfeed/NewsfeedStore';
import notifications from './src/notifications/NotificationsStore';
import notificationsSettings from './src/notifications/NotificationsSettingsStore';
import messengerList from './src/messenger/MessengerListStore';
import channel from './src/channel/ChannelStore';
import user from './src/auth/UserStore';
import channelfeed from './src/channel/ChannelFeedStore';
import comments from './src/comments/CommentsStore';
import discovery from './src/discovery/DiscoveryStore';
import blogs from './src/blogs/BlogsStore';
import wallet from './src/wallet/WalletStore';
import wire from './src/wire/WireStore';

const Stack = StackNavigator({
  Loading: {
    screen: LoadingScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
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
  },
  Comments: {
    screen: CommentsScreen
  },
  DiscoveryView: {
    screen: DiscoveryViewScreen
  },
  Conversation: {
    screen: ConversationScreen
  },
  Settings: {
    screen: SettingsScreen
  },
  GroupsList: {
    screen: GroupsListScreen
  },
  GroupsJoin: {
    screen: GroupJoinScreen
  },
  Wallet: {
    screen: WalletScreen
  },
  BlogList: {
    screen: BlogsListScreen
  },
  WireFab: {
    screen: FabScreen
  }
});

// Stores
const stores = {
  newsfeed,
  notifications,
  notificationsSettings,
  messengerList,
  channel,
  channelfeed,
  comments,
  user,
  discovery,
  blogs,
  wallet,
  wire
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