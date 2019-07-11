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
import testID from '../common/helpers/testID';
import FeedList from '../common/components/FeedList';
import featuresService from '../common/services/features.service';

/**
 * News Feed Screen
 */
@inject('newsfeed', 'user', 'discovery')
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
    this.loadFeed();
    // this.props.newsfeed.loadBoosts();

    this.disposeEnter = this.props.navigation.addListener('didFocus', (s) => {
      const params = this.props.navigation.state.params;
      if (params && params.prepend) {

        this.props.newsfeed.prepend(params.prepend);

        // we clear the parameter to prevent prepend it again on goBack
        this.props.navigation.setParams({prepend: null});
      }
    });
  }

  async loadFeed() {
    if (featuresService.has('es-feeds')) {
      await this.props.newsfeed.feedStore.fetchLocalOrRemote();
      // load groups after the feed
      await this.groupsBar.wrappedInstance.initialLoad();
      // load discovery after the feed is loaded
      this.props.discovery.fetch();
    } else {
      this.props.newsfeed.loadFeed();
    }
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.disposeEnter.remove();
  }

  setGroupsBarRef = (r) => this.groupsBar = r;

  render() {
    const newsfeed = this.props.newsfeed;

    const header = (
      <View>
        <Topbar />
        <GroupsBar ref={this.setGroupsBarRef}/>
        { false ?
          <BoostsCarousel boosts={newsfeed.boosts} navigation={this.props.navigation} store={newsfeed} me={this.props.user.me}/>
          : null }
      </View>
    );

    if (newsfeed.filter == 'subscribed' && featuresService.has('es-feeds')) {
      return (
        <View style={CommonStyle.flexContainer} {...testID('Newsfeed Screen')}>
          <FeedList
            feedStore={newsfeed.feedStore}
            header={header}
            navigation={this.props.navigation}
          />
          <CaptureFab navigation={this.props.navigation}/>
        </View>
      );
    }

    return (
      <View style={CommonStyle.flexContainer} {...testID('Newsfeed Screen')}>
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
