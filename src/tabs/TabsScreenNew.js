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


import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import DiscoveryScreen from '../discovery/DiscoveryScreen';
import featuresService from '../common/services/features.service';
import { withErrorBoundaryScreen } from '../common/components/ErrorBoundary';
import isIphoneX from '../common/helpers/isIphoneX';
import CapturePoster from '../capture/CapturePoster';
import TopbarNew from '../topbar/TopbarNew';
import MoreScreenNew from './MoreScreenNew';

import ThemedStyles from '../styles/ThemedStyles';

let screens = {

  Newsfeed: {
    screen: withErrorBoundaryScreen(NewsfeedScreen),
    navigationOptions: {
      tabBarTestID:'Newsfeed tab button',
      tabBarAccessibilityLabel: 'Newsfeed tab button',
    },
  },
  Discovery: {
    screen: withErrorBoundaryScreen(DiscoveryScreen),
    navigationOptions: {
      tabBarTestID:'Discovery tab button',
      tabBarAccessibilityLabel: 'Discovery tab button',
    },
  },
  Capture: {
    screen: withErrorBoundaryScreen(CapturePoster),
    navigationOptions: {
      tabBarTestID:'Capture tab button',
      tabBarAccessibilityLabel: 'Capture tab button',
    },
  },
  Notifications: {
    screen: withErrorBoundaryScreen(NotificationsScreen),
    navigationOptions: {
      tabBarTestID:'Notifications tab button',
      tabBarAccessibilityLabel: 'Notifications tab button',
    },
  },
  Menu: {
    screen: withErrorBoundaryScreen(MoreScreenNew),
    navigationOptions: {
      tabBarTestID:'Menu tab button',
      tabBarAccessibilityLabel: 'Menu tab button',
    },
  },
};

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
      activeTintColor: '#0091FF',
      inactiveTintColor: '#777777',
      style: {
        backgroundColor: ThemedStyles.getColor('secondary_background'),
        height: 70,
      },
      indicatorStyle: {
        marginBottom: isIphoneX ? 10 : null,
        backgroundColor: 'transparent'
      },
      iconStyle: {
        height: 44,
        width: 44,
        ...ThemedStyles.style.centered,
      }
    },
    initialRouteName: 'Newsfeed',
    navigationOptions: {
      header: null,
    }
  })
);

const inset = { bottom: 'always', top: 'never' };

export default Tabs;
