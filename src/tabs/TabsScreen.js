import React, {
    Component
} from 'react';
import {
  TabNavigator
} from 'react-navigation';

import Topbar from '../topbar/Topbar';
import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import DiscoveryScreen from '../discovery/DiscoveryScreen';
import MessengerScreen from '../messenger/MessengerScreen';
import WalletScreen from '../wallet/WalletScreen';
import MoreScreen from './MoreScreen';
import tabs from './TabsStore';

const Tabs = (
  TabNavigator({
    Wallet: {
      screen: WalletScreen,
    },
    Discovery: {
      screen: DiscoveryScreen,
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
  }, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    lazy: true,
    navigationOptions: ({ navigation }) => ({
      tabBarOnPress: (e) => {
        e.jumpToIndex(e.scene.index);
        tabs.setState({previousScene: e.previousScene, scene: e.scene});
      },
    }),
    tabBarOptions: {
      showLabel: false,
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