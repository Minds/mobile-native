import React, {
    Component
} from 'react';
import {
  createMaterialTopTabNavigator,
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
import WalletScreen from '../wallet/WalletScreen';
import ComingSoonScreen from '../static-views/ComingSoonScreen';
import NotSupportedScreen from '../static-views/NotSupportedScreen';
import MoreScreen from './MoreScreen';
import stores from '../../AppStores';
import featuresService from '../common/services/features.service';
import { withErrorBoundaryScreen } from '../common/components/ErrorBoundary';
import isIphoneX from '../common/helpers/isIphoneX';

let platformWalletScreen = WalletScreen;

const screens = {
  Wallet: {
    screen: withErrorBoundaryScreen(platformWalletScreen),
    navigationOptions: {
      tabBarTestID:'Wallet tab button',
      tabBarAccessibilityLabel: 'Wallet tab button',
    },
  },
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
      tabBarTestID:'Messenger tab button',
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

if (!featuresService.has('crypto')) {
  delete screens.Wallet;
}

const Tabs = (
  createMaterialTopTabNavigator(screens, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: true,
    lazy: false,
    removeClippedSubviews: true,
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
  })
);

const inset = { bottom: 'always', top: 'never' };

export default class TabsScreen extends Component {
  // link router between tab and main stack navigator
  static router = Tabs.router;

  static navigationOptions = {
    header: props => <Topbar {...props} />,
  }

  render() {
    return (
      <Tabs navigation={this.props.navigation}/>
    );
  }
}
