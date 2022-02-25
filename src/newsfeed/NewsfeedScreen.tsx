import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { View } from 'react-native';
import throttle from 'lodash/throttle';

import FeedList, { InjectItem } from '../common/components/FeedList';
import type { AppStackParamList } from '../navigation/NavigationTypes';
import type UserStore from '../auth/UserStore';
import type NewsfeedStore from './NewsfeedStore';
import CheckLanguage from '../common/components/CheckLanguage';
import ActivityPlaceHolder from './ActivityPlaceHolder';
import PortraitContentBar from '../portrait/PortraitContentBar';
import InitialOnboardingButton from '../onboarding/v2/InitialOnboardingButton';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import SocialCompassPrompt from '../common/components/social-compass/SocialCompassPrompt';
import Feature from '~/common/components/Feature';
import Topbar from '~/topbar/Topbar';
import ThemedStyles from '~/styles/ThemedStyles';
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import { IfFeatureEnabled } from '@growthbook/growthbook-react';

type NewsfeedScreenRouteProp = RouteProp<AppStackParamList, 'Newsfeed'>;
type NewsfeedScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Newsfeed'
>;

const sticky = [0];

type NewsfeedScreenProps = {
  navigation: NewsfeedScreenNavigationProp;
  user: UserStore;
  newsfeed: NewsfeedStore<any>;
  route: NewsfeedScreenRouteProp;
};

type NewsfeedScreenState = { shadowLessTopBar: boolean };

/**
 * News Feed Screen
 */
@inject('newsfeed', 'user')
@observer
class NewsfeedScreen extends Component<
  NewsfeedScreenProps,
  NewsfeedScreenState
> {
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
   * whether the topbar should be shadowLess
   */
  shadowLessTopBar: boolean = true;
  injectItems: InjectItem[] = [
    {
      indexes: [2],
      component: () => (
        <IfFeatureEnabled feature="channel-recommendations">
          <ChannelRecommendation location="newsfeed" />
        </IfFeatureEnabled>
      ),
    },
  ];

  constructor(props) {
    super(props);

    this.onScroll = throttle(this.onScroll, 100);
    this.state = {
      shadowLessTopBar: true,
    };
  }

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
    this.disposeTabPress = this.props.navigation.getParent()?.addListener(
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
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    if (this.disposeTabPress) {
      this.disposeTabPress();
    }
  }

  refreshPortrait = () => {
    if (this.portraitBar.current) {
      this.portraitBar.current.load();
    }
  };

  onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const offsetTop = e?.nativeEvent?.contentOffset?.y;

    if (offsetTop > 90 && this.state.shadowLessTopBar) {
      this.setState({ shadowLessTopBar: false });
    }

    if (offsetTop <= 90 && !this.state.shadowLessTopBar) {
      this.setState({ shadowLessTopBar: true });
    }
  };

  /**
   * Render
   */
  render() {
    const newsfeed = this.props.newsfeed;

    const header = (
      <View style={ThemedStyles.style.bgPrimaryBackground}>
        <Topbar
          shadowLess={this.state.shadowLessTopBar}
          navigation={this.props.navigation}
        />
      </View>
    );

    const prepend = (
      <View style={ThemedStyles.style.bgPrimaryBackground}>
        <Feature feature="social-compass">
          <SocialCompassPrompt />
        </Feature>
        <CheckLanguage />
        <InitialOnboardingButton />
        <PortraitContentBar ref={this.portraitBar} />
      </View>
    );

    // Show placeholder before the loading as an empty component.
    const additionalProps = newsfeed.feedStore.loaded ? null : this.emptyProps;

    return (
      <FeedList
        stickyHeaderHiddenOnScroll={true}
        prepend={prepend}
        stickyHeaderIndices={sticky}
        ref={newsfeed.setListRef}
        header={header}
        feedStore={newsfeed.feedStore}
        navigation={this.props.navigation}
        afterRefresh={this.refreshPortrait}
        onScroll={this.onScroll}
        injectItems={this.injectItems}
        {...additionalProps}
      />
    );
  }
}

export default withErrorBoundary(NewsfeedScreen);
