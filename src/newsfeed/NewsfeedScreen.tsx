import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { View } from 'react-native';

import FeedList from '../common/components/FeedList';
import type { AppStackParamList } from '../navigation/NavigationTypes';
import type MessengerListStore from '../messenger/MessengerListStore';
import type UserStore from '../auth/UserStore';
import type NewsfeedStore from './NewsfeedStore';
import CheckLanguage from '../common/components/CheckLanguage';
import ActivityPlaceHolder from './ActivityPlaceHolder';
import PortraitContentBar from '../portrait/PortraitContentBar';
import InitialOnboardingButton from '../onboarding/v2/InitialOnboardingButton';
import { withErrorBoundary } from '../common/components/ErrorBoundary';

type NewsfeedScreenRouteProp = RouteProp<AppStackParamList, 'Newsfeed'>;
type NewsfeedScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Newsfeed'
>;

type PropsType = {
  navigation: NewsfeedScreenNavigationProp;
  user: UserStore;
  messengerList: MessengerListStore;
  newsfeed: NewsfeedStore<any>;
  route: NewsfeedScreenRouteProp;
};

/**
 * News Feed Screen
 */
@inject('newsfeed', 'user', 'messengerList')
@observer
class NewsfeedScreen extends Component<PropsType> {
  disposeTabPress?: Function;
  portraitBar = React.createRef<any>();
  emptyProps = {
    ListEmptyComponent: (
      <View>
        <ActivityPlaceHolder />
        <ActivityPlaceHolder />
      </View>
    ),
  };

  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    this.props.navigation.navigate('Capture', {});
  };

  refreshNewsfeed = e => {
    if (this.props.navigation.isFocused()) {
      this.props.newsfeed.scrollToTop();
      this.props.newsfeed.feedStore.refresh();
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
    // this.props.discovery.init();

    await this.props.newsfeed.feedStore.fetchLocalThenRemote();

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

  refreshPortrait = () => {
    if (this.portraitBar.current) {
      this.portraitBar.current.load();
    }
  };

  /**
   * Render
   */
  render() {
    const newsfeed = this.props.newsfeed;

    const header = (
      <View>
        <CheckLanguage />
        <InitialOnboardingButton />
        <PortraitContentBar ref={this.portraitBar} />
      </View>
    );

    // Show placeholder before the loading as an empty component.
    const additionalProps = newsfeed.feedStore.loaded ? null : this.emptyProps;

    return (
      <FeedList
        ref={newsfeed.setListRef}
        header={header}
        feedStore={newsfeed.feedStore}
        navigation={this.props.navigation}
        afterRefresh={this.refreshPortrait}
        onScroll={newsfeed.setScroll}
        {...additionalProps}
      />
    );
  }
}

export default withErrorBoundary(NewsfeedScreen);
