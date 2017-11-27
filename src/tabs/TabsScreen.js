import React, {
    Component
} from 'react';
import {
  TabNavigator
} from 'react-navigation';

import Topbar from '../topbar/Topbar';
import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import DiscoveryScreen from '../discovery/DiscoveryScreen';
import CaptureScreen from '../capture/CaptureScreen';
import MessengerScreen from '../messenger/MessengerScreen';
import MoreScreen from './MoreScreen';

const Tabs = TabNavigator({
  Newsfeed: {
    screen: NewsfeedScreen,
  },
  Discovery: {
    screen: DiscoveryScreen,
  },
  Capture: {
    screen: CaptureScreen
  },
  Messenger: {
    screen: MessengerScreen
  },
  More: {
    screen: MoreScreen
  },
}, {
  tabBarPosition: 'bottom',
  animationEnabled: false,
  lazy: true,
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    activeTintColor: '#FFF',
    style: {
      backgroundColor: '#222'
    }
  },
});

export default class TabsScreen extends Component {

  static navigationOptions = {
    //title: '',
    header: props => <Topbar {...props} />,
  }

  render() {
    return (
      <Tabs />
    );
  }

}