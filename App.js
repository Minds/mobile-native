import './global';
import './shim'
import crypto from "crypto"; // DO NOT REMOVE!

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { Alert } from 'react-native';
import { Provider } from 'mobx-react/native'; // import from mobx-react/native instead of mobx-react fix test

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
import GroupViewScreen from './src/groups/GroupViewScreen';
import WalletScreen from './src/wallet/WalletScreen';
import WalletHistoryScreen from './src/wallet/WalletHistoryScreen';
import BoostConsoleScreen from './src/boost/BoostConsoleScreen';
import BlogsListScreen from './src/blogs/BlogsListScreen';
import BlogsViewScreen from './src/blogs/BlogsViewScreen';
import FabScreen from './src/wire/FabScreen';
import ActivityScreen from './src/newsfeed/ActivityScreen';
import ViewImageScreen from './src/media/ViewImageScreen';
import BlockchainSettingsScreen from "./src/blockchain/BlockchainSettingsScreen";
import KeychainModalScreen from './src/keychain/KeychainModalScreen';
import BoostScreen from './src/boost/BoostScreen';

import newsfeed from './src/newsfeed/NewsfeedStore';
import boost from './src/boost/BoostStore';
import notifications from './src/notifications/NotificationsStore';
import notificationsSettings from './src/notifications/NotificationsSettingsStore';
import messengerList from './src/messenger/MessengerListStore';
import messengerConversation from './src/messenger/MessengerConversationStore';
import channel from './src/channel/ChannelStore';
import user from './src/auth/UserStore';
import channelfeed from './src/channel/ChannelFeedStore';
import comments from './src/comments/CommentsStore';
import discovery from './src/discovery/DiscoveryStore';
import blogs from './src/blogs/BlogsStore';
import wallet from './src/wallet/WalletStore';
import walletHistory from './src/wallet/WalletHistoryStore';
import wire from './src/wire/WireStore';
import groups from './src/groups/GroupsStore';
import groupView from './src/groups/GroupViewStore';
import blockchain from './src/blockchain/BlockchainStore';
import keychain from './src/keychain/KeychainStore';
import tabs from './src/tabs/TabsStore';

/**
 * Just for testing. We can call an endpoint here to report the exception
 * js UI functionality is not available on native exceptions!
 */
import { setNativeExceptionHandler, setJSExceptionHandler } from 'react-native-exception-handler';
import sessionService from './src/common/services/session.service';

// Error Handlers
const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
      `,
      [{
        text: 'Ok',
      }]
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};
  //Second argument is a boolean with a default value of false if unspecified.
  //If set to true the handler to be called in place of RED screen
  //in development mode also.
setJSExceptionHandler(errorHandler, true);
setNativeExceptionHandler((exceptionString) => {
  console.log(exceptionString);
});

const Stack = StackNavigator({
  Loading: {
    screen: LoadingScreen,
  },
  Boost: {
    screen: BoostScreen,
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
  GroupView: {
    screen: GroupViewScreen
  },
  Wallet: {
    screen: WalletScreen
  },
  BlogList: {
    screen: BlogsListScreen
  },
  BoostConsole: {
    screen: BoostConsoleScreen
  },
  BlogView: {
    screen: BlogsViewScreen
  },
  WireFab: {
    screen: FabScreen
  },
  Activity: {
    screen: ActivityScreen
  },
  WalletHistory: {
    screen: WalletHistoryScreen
  },
  ViewImage: {
    screen: ViewImageScreen
  },
  BlockchainSettings: {
    screen: BlockchainSettingsScreen
  },
});

// Stores
const stores = {
  newsfeed,
  notifications,
  notificationsSettings,
  messengerList,
  messengerConversation,
  channel,
  channelfeed,
  comments,
  user,
  discovery,
  blogs,
  wallet,
  wire,
  boost,
  walletHistory,
  groups,
  groupView,
  blockchain,
  keychain,
  tabs
};

// clear states on logout
sessionService.onLogout(() => {
  newsfeed.clearFeed();
  newsfeed.clearBoosts();
  discovery.list.clearList();
  user.clearUser();
});

export default class App extends Component {
  render() {
    const app = (
      <Provider key="app" {...stores}>
        <Stack />
      </Provider>
    );

    const keychainModal = (
      <KeychainModalScreen key="keychainModal" keychain={ keychain } />
    );

    return [ app, keychainModal ];
  }
}
