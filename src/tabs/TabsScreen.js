import React, {
    Component
} from 'react';
import {
  createMaterialTopTabNavigator,
  jumpTo
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
import DiscoveryScreenLegacy from '../discovery/DiscoveryScreenLegacy';
import MessengerScreen from '../messenger/MessengerScreen';
import WalletScreen from '../wallet/WalletScreen';
import ComingSoonScreen from '../static-views/ComingSoonScreen';
import NotSupportedScreen from '../static-views/NotSupportedScreen';
import MoreScreen from './MoreScreen';
import stores from '../../AppStores';
import featuresService from '../common/services/features.service';
import FeatureFlagSelect from '../common/components/FeatureFlagSelect';

let platformWalletScreen = WalletScreen;

// Feature top-feeds
const DiscoveryScreenComponent = FeatureFlagSelect(DiscoveryScreen, DiscoveryScreenLegacy, 'top-feeds');
// static otptions for the tab
DiscoveryScreenComponent.navigationOptions = DiscoveryScreen.navigationOptions;

const screens = {
  Wallet: {
    screen: platformWalletScreen,
  },
  Discovery: {
    screen: DiscoveryScreenComponent,
  },
  Newsfeed: {
    screen: NewsfeedScreen,
  },
  Messenger: {
    screen: MessengerScreen
  },
  Notifications: {
    screen: NotificationsScreen,
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
      showLabel: (Platform.OS == 'ios' && aspectRatio < 1.6)  ? true : false,
      showIcon: true,
      activeTintColor: '#FFF',
      style: {
        backgroundColor: '#222',
      }
    },
    initialRouteName: 'Newsfeed',
  })
);

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
