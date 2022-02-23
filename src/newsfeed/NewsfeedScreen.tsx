import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { inject, observer } from 'mobx-react';
import React, { Component, useCallback } from 'react';
import { View } from 'react-native';
import throttle from 'lodash/throttle';

import FeedList from '../common/components/FeedList';
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
import { storages } from '~/common/services/storage/storages.service';
import Experiment from '~/common/components/Experiment';
import { Button } from '~/common/ui';

const FEED_TYPE_KEY = 'newsfeed:feedType';

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
  state = {
    feedType: 'latest',
  };

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

    const storedFeedType = storages.user?.getString(FEED_TYPE_KEY);
    if (storedFeedType) {
      this.setState({
        feedType: storedFeedType,
      });
    }
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

  handleFeedTypeChange = feedType => {
    storages.user?.setString(FEED_TYPE_KEY, feedType);
    this.setState({ feedType });
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
        <Feature feature="top-feed">
          <Experiment experiment="top-feed-2" variation="on">
            <NewsfeedHeader
              feedType={this.state.feedType}
              onFeedTypeChange={this.handleFeedTypeChange}
            />

            {this.state.feedType === 'top' && (
              <TopFeedMini feed={newsfeed.topFeedStore} />
            )}
          </Experiment>
        </Feature>
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
        feedStore={newsfeed.latestFeedStore}
        navigation={this.props.navigation}
        afterRefresh={this.refreshPortrait}
        onRefresh={this.props.newsfeed.refreshFeed}
        refreshing={this.props.newsfeed.refreshing}
        onScroll={this.onScroll}
        {...additionalProps}
      />
    );
  }
}

const TopFeedMini = observer(({ feed }) => {
  const navigation = useNavigation();
  const navigateToTopFeed = useCallback(
    () => navigation.navigate('TopNewsfeed'),
    [navigation],
  );

  if (!feed.entities.length) {
    return null;
  }

  return (
    <>
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
          onPress={navigateToTopFeed}>
          {i18nService.t('newsfeed.seeMoreTopPosts')}
        </Button>
      </View>

      <NewsfeedHeader feedType={'latest'} />
    </>
  );
});

const moreTopPostsButtonStyle = ThemedStyles.combine({ marginTop: -22 });

export default withErrorBoundary(NewsfeedScreen);
