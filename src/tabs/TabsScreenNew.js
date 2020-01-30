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
import { CommonStyle as CS } from '../styles/Common';
import CapturePoster from '../capture/CapturePoster';
import TopbarNew from '../topbar/TopbarNew';
import MoreScreenNew from './MoreScreenNew';

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
        ...CS.backgroundThemeSecondary,
        marginBottom: isIphoneX ? 10 : null,
        height: 60,
      },
      indicatorStyle: {
        marginBottom: isIphoneX ? 10 : null,
        backgroundColor: 'transparent'
      },
      iconStyle: {
        height: 44,
        width: 44,
        ...CS.centered,
      }
    },
    initialRouteName: 'Newsfeed',
  })
);

const inset = { bottom: 'always', top: 'never' };

export default class TabsScreenNew extends Component {
  // link router between tab and main stack navigator
  static router = Tabs.router;

  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <Tabs navigation={this.props.navigation}/>
    );
  }
}
