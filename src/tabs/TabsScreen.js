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
import tabs from './TabsStore';

const Tabs = (
  TabNavigator({
    Newsfeed: {
      screen: NewsfeedScreen,
    },
    Discovery: {
      screen: DiscoveryScreen,
    },
    Capture: {
      screen: CaptureScreen,
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
        backgroundColor: '#222'
      }
    },
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