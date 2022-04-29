import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import throttle from 'lodash/throttle';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { View } from 'react-native';
import Feature from '~/common/components/Feature';
import Topbar from '~/topbar/Topbar';

import FeedList, { InjectItem } from '../common/components/FeedList';
import type { AppStackParamList } from '../navigation/NavigationTypes';
import type UserStore from '../auth/UserStore';
import CheckLanguage from '../common/components/CheckLanguage';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import SocialCompassPrompt from '../common/components/social-compass/SocialCompassPrompt';
import InitialOnboardingButton from '../onboarding/v2/InitialOnboardingButton';
import PortraitContentBar from '../portrait/PortraitContentBar';
import ActivityPlaceHolder from './ActivityPlaceHolder';
import NewsfeedHeader from './NewsfeedHeader';
import type NewsfeedStore from './NewsfeedStore';
import TopFeedHighlights from './TopFeedHighlights';
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import { hasVariation } from 'ExperimentsProvider';
import { SeeLatestPostsButton } from './SeeLatestPostsButton';

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

type NewsfeedScreenState = {
  shadowLessTopBar: boolean;
};

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
    {
      indexes: [3],
      component: () => (
        <IfFeatureEnabled feature="top-feed-2">
          <TopFeedHighlights
            onSeeTopFeedPress={() => {
              this.props.newsfeed.listRef?.scrollToTop(true);
              setTimeout(() => {
                this.props.newsfeed.changeFeedTypeChange('top', true);
              }, 500);
            }}
          />
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

  refreshNewsfeed = () => {
    this.props.newsfeed.scrollToTop();
    this.props.newsfeed.latestFeedStore.refresh();
    this.props.newsfeed.topFeedStore.refresh();
  };

  onTabPress = e => {
    if (this.props.navigation.isFocused()) {
      this.refreshNewsfeed();
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
      this.onTabPress,
    );

    this.loadFeed();
    // this.props.newsfeed.loadBoosts();
  }

  async loadFeed() {
    await this.props.newsfeed.loadFeed();
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.disposeTabPress?.();
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
    const isLatest = this.props.newsfeed.feedType === 'latest';

    const header = (
      <View style={isLatest ? latestPostsContainerStyles.header : undefined}>
        <Topbar
          shadowLess={this.state.shadowLessTopBar}
          navigation={this.props.navigation}
        />
        {isLatest && (
          <IfFeatureEnabled feature="mob-4193-polling">
            <SeeLatestPostsButton
              onPress={this.refreshNewsfeed}
              feedStore={newsfeed.latestFeedStore}
            />
          </IfFeatureEnabled>
        )}
      </View>
    );

    const prepend = (
      <View style={isLatest ? latestPostsContainerStyles.prepend : undefined}>
        <Feature feature="social-compass">
          <SocialCompassPrompt />
        </Feature>
        <CheckLanguage />
        <InitialOnboardingButton />
        <PortraitContentBar ref={this.portraitBar} />
        <IfFeatureEnabled feature="top-feed-2">
          <NewsfeedHeader
            feedType={this.props.newsfeed.feedType}
            onFeedTypeChange={this.props.newsfeed.changeFeedTypeChange}
          />
        </IfFeatureEnabled>
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
        feedStore={
          this.props.newsfeed.feedType === 'latest'
            ? newsfeed.latestFeedStore
            : newsfeed.topFeedStore
        }
        navigation={this.props.navigation}
        afterRefresh={this.refreshPortrait}
        onScroll={this.onScroll}
        injectItems={
          this.props.newsfeed.feedType === 'latest'
            ? this.injectItems
            : undefined
        }
        {...additionalProps}
      />
    );
  }
}

export default withErrorBoundary(NewsfeedScreen);

/**
 * these styles are used to hide the latest posts button completely when there's some notch
 * on top of the screen. It's a little hard to explain. But if you remove these from the
 * iPhone 13, the button will be partially visible under the notch, but with these styles
 * the button will get out of the screen
 */
const latestPostsContainerStyles = {
  header: { paddingBottom: 50 },
  prepend: { marginTop: -50 },
};
