import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { View } from 'react-native';

import NewsfeedList from './NewsfeedList';
import Topbar from './topbar/Topbar';
import { CommonStyle } from '../styles/Common';
import GroupsBar from '../groups/GroupsBar';
import FeedList from '../common/components/FeedList';
import i18n from '../common/services/i18n.service';
import TopbarNewsfeed from '../topbar/TopbarNewsfeed';
import type { RootStackParamList } from 'src/navigation/NavigationTypes';
import type MessengerListStore from 'src/messenger/MessengerListStore';
import type DiscoveryStore from 'src/discovery/DiscoveryStore';
import type UserStore from 'src/auth/UserStore';
import type NewsfeedStore from './NewsfeedStore';

type NewsfeedScreenRouteProp = RouteProp<RootStackParamList, 'Newsfeed'>;
type NewsfeedcreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Newsfeed'
>;

type PropsType = {
  navigation: NewsfeedcreenNavigationProp;
  discovery: DiscoveryStore;
  user: UserStore;
  messengerList: MessengerListStore;
  newsfeed: NewsfeedStore;
  route: NewsfeedScreenRouteProp;
};

/**
 * News Feed Screen
 */
@inject('newsfeed', 'user', 'discovery', 'messengerList')
@observer
class NewsfeedScreen extends Component<PropsType> {
  disposeTabPress?: Function;
  groupsBar: GroupsBar | null = null;

  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    this.props.navigation.navigate('Capture');
  };

  refreshNewsfeed = (e) => {
    if (this.props.navigation.isFocused()) {
      if (this.props.newsfeed.filter === 'subscribed') {
        this.props.newsfeed.scrollToTop();
        this.props.newsfeed.feedStore.refresh();
      } else {
        this.props.newsfeed.refresh();
      }
      e && e.preventDefault();
    }
  };

  /**
   * Load data on mount
   */
  componentDidMount() {
    this.disposeTabPress = this.props.navigation.addListener(
      //@ts-ignore
      'tabPress',
      this.refreshNewsfeed,
    );

    this.loadFeed();
    // this.props.newsfeed.loadBoosts();
  }

  async loadFeed() {
    this.props.discovery.init();

    await this.props.newsfeed.feedStore.fetchRemoteOrLocal();

    // load groups after the feed
    await this.groupsBar?.initialLoad();
    // load discovery after the feed is loaded
    this.props.discovery.fetch();

    // load messenger
    this.props.messengerList.loadList();

    // listen socket on app start
    this.props.messengerList.listen();
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.props.messengerList.unlisten();
    if (this.disposeTabPress) {
      this.disposeTabPress();
    }
  }

  setGroupsBarRef = (r) => (this.groupsBar = r);

  render() {
    const newsfeed = this.props.newsfeed;

    //@ts-ignore
    const topBar = <Topbar />;

    const header = (
      <View>
        {topBar}
        <GroupsBar ref={this.setGroupsBarRef} />
      </View>
    );

    let feed;
    if (newsfeed.filter === 'subscribed') {
      feed = (
        <FeedList
          ref={newsfeed.setListRef}
          feedStore={newsfeed.feedStore}
          header={header}
          navigation={this.props.navigation}
        />
      );
    } else {
      feed = (
        <NewsfeedList
          newsfeed={newsfeed}
          header={header}
          navigation={this.props.navigation}
        />
      );
    }

    return (
      <View style={CommonStyle.flexContainer} testID="NewsfeedScreen">
        <TopbarNewsfeed
          title={i18n.t('tabTitleNewsfeed')}
          navigation={this.props.navigation}
          refreshFeed={this.refreshNewsfeed}
        />
        {feed}
        {/* <CaptureFab navigation={this.props.navigation} route={this.props.route} testID="captureFab"/> */}
      </View>
    );
  }
}

export default NewsfeedScreen;
