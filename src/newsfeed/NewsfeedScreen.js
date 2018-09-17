import React, { Component } from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import { View } from 'react-native';

import { Icon } from 'react-native-elements'
import IonIcon from 'react-native-vector-icons/Ionicons';

import NewsfeedList from './NewsfeedList';
import CenteredLoading from '../common/components/CenteredLoading';
import BoostsCarousel from './boosts/BoostsCarousel';
import Topbar from './topbar/Topbar';
import CaptureFab from '../capture/CaptureFab';
import stores from '../../AppStores';

/**
 * News Feed Screen
 */
@inject('newsfeed', 'user')
@observer
export default class NewsfeedScreen extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <IonIcon name="md-home" size={24} color={tintColor} />
    ),
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      // tab button tapped again?
      if (navigation.isFocused()) {
        stores.newsfeed.refresh();
        return;
      }
      defaultHandler();
    }
  }

  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    this.props.navigation.navigate('Capture');
  }

  /**
   * Load data on mount
   */
  componentWillMount() {
    this.props.newsfeed.loadFeed();
    this.props.newsfeed.loadBoosts();
  }

  componentDidMount() {
    const navParams = this.props.navigation.state.params;

    if (navParams && navParams.prepend) {
      this.props.newsfeed.prepend(navParams.prepend);
    }
  }

  render() {
    const newsfeed = this.props.newsfeed;

    const header = (
      <View>
        <Topbar />
        { false ?
          <BoostsCarousel boosts={newsfeed.boosts} navigation={this.props.navigation} store={newsfeed} me={this.props.user.me}/>
          : null }
      </View>
    );

    return (
      <View style={{flex:1}}>
        <NewsfeedList
          newsfeed={newsfeed}
          header={header}
          navigation={this.props.navigation}
          />
        <CaptureFab navigation={this.props.navigation}/>
      </View>
    );
  }
}
