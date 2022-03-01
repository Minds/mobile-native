import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { inject, observer } from 'mobx-react';
import React, { Component, useEffect, useRef } from 'react';
import { InteractionManager, View } from 'react-native';
import throttle from 'lodash/throttle';

import FeedList, { InjectItem } from '../common/components/FeedList';
import type { AppStackParamList } from '../navigation/NavigationTypes';
import type UserStore from '../auth/UserStore';
import CheckLanguage from '../common/components/CheckLanguage';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import SocialCompassPrompt from '../common/components/social-compass/SocialCompassPrompt';
import Feature from '~/common/components/Feature';
import Topbar from '~/topbar/Topbar';
import ThemedStyles from '~/styles/ThemedStyles';
import InitialOnboardingButton from '../onboarding/v2/InitialOnboardingButton';
import PortraitContentBar from '../portrait/PortraitContentBar';
import ActivityPlaceHolder from './ActivityPlaceHolder';
import NewsfeedHeader from './NewsfeedHeader';
import type NewsfeedStore from './NewsfeedStore';
import i18nService from '~/common/services/i18n.service';
import { Button } from '~/common/ui';
import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import FeedStore from '~/common/stores/FeedStore';
import MetadataService from '~/common/services/metadata.service';

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

  refreshNewsfeed = e => {
    if (this.props.navigation.isFocused()) {
      this.props.newsfeed.scrollToTop();
      this.props.newsfeed.latestFeedStore.refresh();
      this.props.newsfeed.topFeedStore.refresh();
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
    await this.props.newsfeed.loadFeed();
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
        <IfFeatureEnabled feature="top-feed-2">
          <NewsfeedHeader
            feedType={this.props.newsfeed.feedType}
            onFeedTypeChange={this.props.newsfeed.changeFeedTypeChange}
          />
        </IfFeatureEnabled>
      </View>
    );

    // Show placeholder before the loading as an empty component.
    const additionalProps = newsfeed.latestFeedStore.loaded
      ? null
      : this.emptyProps;

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

const TopFeedHighlights = observer(({ onSeeTopFeedPress }) => {
  const feed = useRef(
    new FeedStore()
      .setEndpoint('api/v3/newsfeed/feed/unseen-top')
      .setInjectBoost(false)
      .setLimit(3)
      .setMetadata(
        new MetadataService()
          .setSource('feed/subscribed')
          .setMedium('top-feed'),
      ),
  ).current;
  const navigation = useNavigation();

  useEffect(() => {
    feed.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!feed.entities.length) {
    return null;
  }

  return (
    <>
      <NewsfeedHeader title="Highlights" />
      <FeedList
        feedStore={feed}
        navigation={navigation}
        onEndReached={undefined}
      />
      <View style={moreTopPostsButtonStyle}>
        <Button
          type="action"
          mode="solid"
          size="small"
          align="center"
          onPress={onSeeTopFeedPress}>
          {i18nService.t('newsfeed.seeMoreTopPosts')}
        </Button>
      </View>
    </>
  );
});

const moreTopPostsButtonStyle = ThemedStyles.combine({ marginTop: -22 });

export default withErrorBoundary(NewsfeedScreen);
