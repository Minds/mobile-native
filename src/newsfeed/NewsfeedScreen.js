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
import { CommonStyle } from '../styles/Common';
import GroupsBar from '../groups/GroupsBar';

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

    this.disposeEnter = this.props.navigation.addListener('didFocus', (s) => {
      const params = this.props.navigation.state.params;
      if (params && params.prepend) {
        this.props.newsfeed.prepend(params.prepend);
        // we clear the parameter to prevent prepend it again on goBack
        this.props.navigation.setParams({prepend: null});
      }
    });
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.disposeEnter.remove();
  }

  render() {
    const newsfeed = this.props.newsfeed;

    const header = (
      <View>
        <Topbar />
        <GroupsBar/>
        { false ?
          <BoostsCarousel boosts={newsfeed.boosts} navigation={this.props.navigation} store={newsfeed} me={this.props.user.me}/>
          : null }
      </View>
    );

    return (
      <View style={CommonStyle.flexContainer}>
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
