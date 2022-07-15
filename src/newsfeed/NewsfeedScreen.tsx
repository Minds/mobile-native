import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import Topbar from '~/topbar/Topbar';
import { View } from 'react-native';

import { InjectItem } from '../common/components/FeedList';
import type { AppStackParamList } from '../navigation/NavigationTypes';
import type UserStore from '../auth/UserStore';
import CheckLanguage from '../common/components/CheckLanguage';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import SocialCompassPrompt from '../common/components/social-compass/SocialCompassPrompt';
import InitialOnboardingButton from '../onboarding/v2/InitialOnboardingButton';
import PortraitContentBar from '../portrait/PortraitContentBar';
import NewsfeedHeader from './NewsfeedHeader';
import type NewsfeedStore from './NewsfeedStore';
import TopFeedHighlights from './TopFeedHighlights';
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import NewsfeedPlaceholder from './NewsfeedPlaceholder';
import SeeLatestPostsButton from './SeeLatestPostsButton';
import ChannelRecommendationHeader from '~/common/components/ChannelRecommendation/ChannelRecommendationHeader';
import { Screen } from '~/common/ui';
import { useLegacyStores } from '~/common/hooks/use-stores';
import ThemedStyles from '~/styles/ThemedStyles';
import FeedListSticky from '~/common/components/FeedListSticky';

type NewsfeedScreenRouteProp = RouteProp<AppStackParamList, 'Newsfeed'>;
type NewsfeedScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Newsfeed'
>;

const sticky = [3, 5, 7, 9];

type NewsfeedScreenProps = {
  navigation: NewsfeedScreenNavigationProp;
  user: UserStore;
  newsfeed: NewsfeedStore<any>;
  route: NewsfeedScreenRouteProp;
};

const invisibleStyle = { width: '100%', height: 1 };

const InvisibleStickyHeader = () => <View style={invisibleStyle} />;

/**
 * News Feed Screen
 */
const NewsfeedScreen = observer(({ navigation }: NewsfeedScreenProps) => {
  const { newsfeed } = useLegacyStores();
  const portraitBar = React.useRef<any>();

  const refreshNewsfeed = useCallback(() => {
    newsfeed.scrollToTop();
    newsfeed.latestFeedStore.refresh();
    newsfeed.topFeedStore.refresh();
  }, [newsfeed]);

  const onTabPress = useCallback(
    e => {
      if (navigation.isFocused()) {
        refreshNewsfeed();
        e && e.preventDefault();
      }
    },
    [navigation, refreshNewsfeed],
  );

  useEffect(() => {
    newsfeed.loadFeed();

    return navigation.getParent()?.addListener(
      //@ts-ignore
      'tabPress',
      onTabPress,
    );
  }, [navigation, newsfeed, onTabPress]);

  const refreshPortrait = useCallback(() => {
    if (portraitBar.current) {
      portraitBar.current.load();
    }
  }, [portraitBar]);

  /**
   * Injected items
   */
  if (!newsfeed.latestFeedStore.injectItems) {
    newsfeed.latestFeedStore.setInjectedItems([
      new InjectItem(0, 'prepend', () => (
        <View>
          <SocialCompassPrompt />
          <CheckLanguage />
          <InitialOnboardingButton />
          <PortraitContentBar ref={portraitBar} />
          <NewsfeedHeader
            feedType={newsfeed.feedType}
            onFeedTypeChange={newsfeed.changeFeedTypeChange}
          />
        </View>
      )),
      new InjectItem(3, 'channel', () => (
        <ChannelRecommendationHeader location="newsfeed" />
      )),
      new InjectItem(4, 'channel', () => (
        <ChannelRecommendation location="newsfeed" />
      )),
      new InjectItem(5, 'end', InvisibleStickyHeader),

      new InjectItem(7, 'highlightheader', () => (
        <NewsfeedHeader title="Highlights" small />
      )),
      new InjectItem(8, 'highlight', () => (
        <TopFeedHighlights
          onSeeTopFeedPress={() => {
            newsfeed.listRef?.scrollToTop(true);
            setTimeout(() => {
              newsfeed.changeFeedTypeChange('top', true);
            }, 500);
          }}
        />
      )),
      new InjectItem(9, 'end', InvisibleStickyHeader),
    ]);

    newsfeed.topFeedStore.setInjectedItems([
      new InjectItem(0, 'prepend', () => (
        <View>
          <SocialCompassPrompt />
          <CheckLanguage />
          <InitialOnboardingButton />
          <PortraitContentBar ref={portraitBar} />
          <NewsfeedHeader
            feedType={newsfeed.feedType}
            onFeedTypeChange={newsfeed.changeFeedTypeChange}
          />
        </View>
      )),
    ]);
  }

  const isLatest = newsfeed.feedType === 'latest';

  return (
    <Screen safe>
      <View style={ThemedStyles.style.flexContainer}>
        <FeedListSticky
          stickyHeaderIndices={isLatest ? sticky : undefined}
          bottomComponent={
            isLatest ? (
              <IfFeatureEnabled feature="mob-4193-polling">
                <SeeLatestPostsButton
                  onPress={refreshNewsfeed}
                  feedStore={newsfeed.latestFeedStore}
                />
              </IfFeatureEnabled>
            ) : undefined
          }
          header={<Topbar noInsets navigation={navigation} />}
          ref={newsfeed.setListRef}
          feedStore={
            isLatest ? newsfeed.latestFeedStore : newsfeed.topFeedStore
          }
          navigation={navigation}
          afterRefresh={refreshPortrait}
          placeholder={NewsfeedPlaceholder}
        />
      </View>
    </Screen>
  );
});

export default withErrorBoundary(NewsfeedScreen);
