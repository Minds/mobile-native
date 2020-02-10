import React, {
    Component
} from 'react';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {
  jumpTo,
  SafeAreaView
} from 'react-navigation';
import {
  Platform,
  Dimensions,
} from 'react-native';

const { height, width } = Dimensions.get('window');
const aspectRatio = height/width;

import Topbar from '../topbar/Topbar';
import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import DiscoveryScreen from '../discovery/DiscoveryScreen';
import MessengerScreen from '../messenger/MessengerScreen';
import featuresService from '../common/services/features.service';
import { withErrorBoundaryScreen } from '../common/components/ErrorBoundary';
import isIphoneX from '../common/helpers/isIphoneX';

let screens = {

  Discovery: {
    screen: withErrorBoundaryScreen(DiscoveryScreen),
    navigationOptions: {
      tabBarTestID:'Discovery tab button',
      tabBarAccessibilityLabel: 'Discovery tab button',
    },
  },
  Newsfeed: {
    screen: withErrorBoundaryScreen(NewsfeedScreen),
    navigationOptions: {
      tabBarTestID:'Newsfeed tab button',
      tabBarAccessibilityLabel: 'Newsfeed tab button',
    },
  },
  Messenger: {
    screen: withErrorBoundaryScreen(MessengerScreen),
    navigationOptions: {
      tabBarTestID:'MessengerTabButton',
      tabBarAccessibilityLabel: 'Messenger tab button',
    },
  },
  Notifications: {
    screen: withErrorBoundaryScreen(NotificationsScreen),
    navigationOptions: {
      tabBarTestID:'Notifications tab button',
      tabBarAccessibilityLabel: 'Notifications tab button',
    },
  }
};

if (featuresService.has('crypto')) {
  const WalletScreen  = require('../wallet/WalletScreen').default;
  screens = {
    Wallet:{
      screen: withErrorBoundaryScreen(WalletScreen),
      navigationOptions: {
        tabBarTestID:'Wallet tab button',
        tabBarAccessibilityLabel: 'Wallet tab button',
      },
    },
    ...screens
  };
}

const Tabs = (
  createMaterialTopTabNavigator(screens, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: true,
    lazy: false,
    removeClippedSubviews: false,
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      activeTintColor: '#FFF',
      style: {
        backgroundColor: '#222',
        paddingBottom: isIphoneX ? 20 : null
      },
      indicatorStyle: {
        marginBottom: isIphoneX ? 20 : null
      }
    },
    initialRouteName: 'Newsfeed',
    navigationOptions: {
      header: props => <Topbar {...props} />,
    }
  })
);

const inset = { bottom: 'always', top: 'never' };

export default Tabs
