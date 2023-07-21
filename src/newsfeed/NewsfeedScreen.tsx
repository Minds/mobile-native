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
import InitialOnboardingButton from '../onboarding/v2/InitialOnboardingButton';
import PortraitContentBar from '../portrait/components/PortraitContentBar';
import type NewsfeedStore from './NewsfeedStore';
import TopFeedHighlights from './TopFeedHighlights';
import ChannelRecommendationBody from '~/common/components/ChannelRecommendation/ChannelRecommendationBody';
import NewsfeedPlaceholder from './NewsfeedPlaceholder';
import SeeLatestPostsButton from './SeeLatestPostsButton';
import ChannelRecommendationHeader from '~/common/components/ChannelRecommendation/ChannelRecommendationHeader';
import { Screen } from '~/common/ui';
import { useLegacyStores, useStores } from '~/common/hooks/use-stores';
import ThemedStyles from '~/styles/ThemedStyles';
import FeedListSticky from '~/common/components/FeedListSticky';
import { ChannelRecommendationProvider } from '~/common/components/ChannelRecommendation/ChannelRecommendationProvider';
import TopFeedHighlightsHeader from './TopFeedHighlightsHeader';
import TopInFeedNotice from '~/common/components/in-feed-notices/TopInFeedNotice';
import InlineInFeedNotice from '~/common/components/in-feed-notices/InlineInFeedNotice';

import PrefetchNotifications from '~/notifications/v3/PrefetchNotifications';
import { IS_IOS } from '~/config/Config';
import { NotificationsTabOptions } from '~/notifications/v3/NotificationsTopBar';
import { useIsFeatureOn } from 'ExperimentsProvider';
import InFeedNoticesService from '~/common/services/in-feed.notices.service';
import { InAppVerificationPrompt } from '../modules/in-app-verification';
import BoostRotator from './boost-rotator/BoostRotator';
import CodePushUpdatePrompt from '../modules/codepush/widgets/CodePushUpdatePrompt';
import RemoteBanner from '~/common/components/RemoteBanner';
import NewsfeedTabs from './NewsfeedTabs';
import {
  RecommendationProvider,
  RecommendationHeader,
  RecommendationBody,
  RecommendationType,
  Recommendation,
} from 'modules/recommendation';
import { GroupsEmpty } from '../modules/groups';

type NewsfeedScreenRouteProp = RouteProp<AppStackParamList, 'Newsfeed'>;
type NewsfeedScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Newsfeed'
>;

const HIGHLIGHT_POSITION = 9;
const RECOMMENDATION_POSITION = 4;

type NewsfeedScreenProps = {
  navigation: NewsfeedScreenNavigationProp;
  user: UserStore;
  newsfeed: NewsfeedStore<any>;
  route: NewsfeedScreenRouteProp;
};

// override item layout to estimate better the top components height and prevent initial jumps
const overrideItemLayout = (layout, item, index) => {
  if (index === 0) {
    layout.size = 157;
  }
};

/**
 * News Feed Screen
 */
const NewsfeedScreen = observer(({ navigation }: NewsfeedScreenProps) => {
  const { newsfeed } = useLegacyStores();
  const portrait = useStores().portrait;
  const inAppVerification = useIsFeatureOn('mob-4472-in-app-verification');

  const refreshNewsfeed = useCallback(() => {
    newsfeed.scrollToTop();
    newsfeed.highlightsStore.refresh();
    newsfeed.latestFeedStore.refresh();
    newsfeed.topFeedStore.refresh();
    newsfeed.forYouStore.refresh();
    newsfeed.groupsFeedStore.refresh();
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

  // delay the load of the portrait feed data
  // we load the data here given that the flashlist is rendering it twice at the first render
  useEffect(() => {
    const t = setTimeout(() => {
      portrait.load();
    }, 1000);
    return () => clearTimeout(t);
  }, [portrait]);

  const refreshPortrait = useCallback(() => {
    portrait.load();
  }, [portrait]);

  /**
   * Injected items
   */
  if (!newsfeed.latestFeedStore.injectItems) {
    // common prepend components
    const prepend = new InjectItem(
      0,
      'prepend',
      () => (
        <>
          <CheckLanguage />
          <CodePushUpdatePrompt>
            <RemoteBanner />
          </CodePushUpdatePrompt>
          <InitialOnboardingButton />
          <PortraitContentBar />
          <TopInFeedNotice />
          {inAppVerification ? <InAppVerificationPrompt /> : null}
          <NewsfeedTabs newsfeed={newsfeed} />
          <BoostRotator />
        </>
      ),
      () => InFeedNoticesService.trackViewTop(),
    );

    // latest feed injected components
    newsfeed.latestFeedStore.setInjectedItems([
      prepend,
      new InjectItem(RECOMMENDATION_POSITION, 'channel', () => (
        <>
          <ChannelRecommendationHeader location="newsfeed" />
          <ChannelRecommendationBody location="newsfeed" />
        </>
      )),
      new InjectItem(
        7,
        'ilNotice',
        () => <InlineInFeedNotice position={1} />,
        () => InFeedNoticesService.trackViewInFeed(1),
      ),
      new InjectItem(HIGHLIGHT_POSITION + 1, 'highlight', () => (
        <>
          <TopFeedHighlightsHeader />
          <TopFeedHighlights
            onSeeTopFeedPress={() => {
              newsfeed.listRef?.scrollToOffset({ animated: true, offset: 0 });
              setTimeout(() => {
                newsfeed.changeFeedType('top', true);
              }, 500);
            }}
          />
        </>
      )),
    ]);

    // top feed injected components
    newsfeed.topFeedStore.setInjectedItems([prepend]);
    // for you injected components
    newsfeed.forYouStore.setInjectedItems([prepend]);
    // groups injected components
    newsfeed.groupsFeedStore
      .setInjectedItems([
        prepend,
        new InjectItem(
          RECOMMENDATION_POSITION,
          'grouprecs-header',
          ({ target }) => (
            <RecommendationHeader
              type="group"
              location="feed"
              shadow={target === 'StickyHeader'}
            />
          ),
        ),
        new InjectItem(RECOMMENDATION_POSITION + 1, 'grouprecs-body', () => (
          <>
            <RecommendationHeader type="group" location="feed" />
            <RecommendationBody size={1} type="group" location="feed" />
          </>
        )),
      ])
      .setEmptyComponent(
        new InjectItem(1, 'empty', () => (
          <>
            <GroupsEmpty />
            <Recommendation size={5} location="feed" type="group" />
          </>
        )),
      );
  }

  const isLatest = newsfeed.feedType === 'latest';

  return (
    <Screen safe onlyTopEdge={IS_IOS}>
      <PrefetchNotifications tabs={prefetch} />
      <ChannelRecommendationProvider location="newsfeed">
        <RecommendationProvider
          location="newsfeed"
          types={RECOMMENDATION_TYPES}>
          <View style={ThemedStyles.style.flexContainer}>
            <FeedListSticky
              overrideItemLayout={overrideItemLayout}
              emphasizeGroup
              bottomComponent={
                isLatest ? (
                  <SeeLatestPostsButton
                    onPress={refreshNewsfeed}
                    feedStore={newsfeed.latestFeedStore}
                  />
                ) : undefined
              }
              header={<Topbar noInsets navigation={navigation} />}
              ref={newsfeed.setListRef}
              feedStore={newsfeed.feedStore}
              afterRefresh={refreshPortrait}
              placeholder={NewsfeedPlaceholder}
            />
          </View>
        </RecommendationProvider>
      </ChannelRecommendationProvider>
    </Screen>
  );
});

const prefetch: NotificationsTabOptions[] = ['all'];
const RECOMMENDATION_TYPES: RecommendationType[] = ['group'];

export default withErrorBoundary(NewsfeedScreen);
