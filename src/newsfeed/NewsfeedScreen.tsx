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
import NewsfeedPlaceholder from './NewsfeedPlaceholder';
import SeeLatestPostsButton from './SeeLatestPostsButton';
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
import { useIsAndroidFeatureOn, useIsFeatureOn } from 'ExperimentsProvider';
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
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import CaptureFab from '~/capture/CaptureFab';

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
  newsfeed: NewsfeedStore;
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
  const inFeedBoostRotator = useIsFeatureOn('mob-5009-boost-rotator-in-feed');
  const inAppVerification = useIsFeatureOn('mob-4472-in-app-verification');
  const showFAB = useIsAndroidFeatureOn('mob-4989-compose-fab');

  const refreshNewsfeed = useCallback(
    (scrollAndRefresh = false) => {
      const position = newsfeed.listRef?.getScrollPosition();
      if (position && position > 10 && !scrollAndRefresh) {
        newsfeed.listRef?.scrollToOffset({ offset: 0, animated: true });
      } else {
        if (scrollAndRefresh) {
          newsfeed.listRef?.scrollToOffset({ offset: 0, animated: true });
        }
        if (
          newsfeed.latestFeedStore.newPostsCount ||
          newsfeed.feedType !== 'latest'
        ) {
          switch (newsfeed.feedType) {
            case 'foryou':
              newsfeed.forYouStore.refresh();
              break;
            case 'latest':
              newsfeed.latestFeedStore.refresh(
                newsfeed.highlightsStore.refresh(), // sync highlights load but wait for it before updating the feed (Performance improvement)
              );
              break;
            case 'top':
              newsfeed.topFeedStore.refresh();
              break;
            case 'groups':
              newsfeed.groupsFeedStore.refresh();
          }
        }
      }
    },
    [newsfeed],
  );

  useEffect(() => {
    const onPress = e => {
      if (navigation.isFocused()) {
        refreshNewsfeed();
        e?.preventDefault();
      }
    };

    newsfeed.loadFeed();
    const parent = navigation.getParent();
    const unsubscribeTab = parent?.addListener<any>('tabPress', onPress);
    const unsubscribeDrawer = parent?.addListener<any>(
      'drawerItemPress',
      onPress,
    );
    return () => {
      unsubscribeTab?.();
      unsubscribeDrawer?.();
    };
  }, [navigation, newsfeed, refreshNewsfeed]);

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
        <View style={ThemedStyles.style.alignSelfCenterMaxWidth}>
          <CheckLanguage />
          <CodePushUpdatePrompt>
            <RemoteBanner />
          </CodePushUpdatePrompt>
          <InitialOnboardingButton />
          <PortraitContentBar />
          <TopInFeedNotice />
          {inAppVerification ? <InAppVerificationPrompt /> : null}
          <NewsfeedTabs newsfeed={newsfeed} />
          {!inFeedBoostRotator && <BoostRotator />}
        </View>
      ),
      () => InFeedNoticesService.trackViewTop(),
    );

    const boostRotatorInjectItem = inFeedBoostRotator
      ? new InjectItem(3, 'rotator', () => <BoostRotator />)
      : undefined;

    // latest feed injected components
    newsfeed.latestFeedStore.setInjectedItems([
      prepend,
      boostRotatorInjectItem,
      new InjectItem(RECOMMENDATION_POSITION, 'channel', () => (
        <ChannelRecommendation location="newsfeed" />
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
    newsfeed.topFeedStore.setInjectedItems([prepend, boostRotatorInjectItem]);
    // for you injected components
    newsfeed.forYouStore.setInjectedItems([prepend, boostRotatorInjectItem]);
    // groups injected components
    newsfeed.groupsFeedStore
      .setInjectedItems([
        prepend,
        new InjectItem(RECOMMENDATION_POSITION, 'grouprecs-body', () => (
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
    <Screen safe onlyTopEdge={IS_IOS} hasMaxWidth={false}>
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
                    onPress={() => refreshNewsfeed(true)}
                    feedStore={newsfeed.latestFeedStore}
                  />
                ) : undefined
              }
              header={<Topbar noInsets navigation={navigation} />}
              ref={newsfeed.setListRef}
              feedStore={newsfeed.feedStore}
              afterRefresh={refreshPortrait}
              placeholder={NewsfeedPlaceholder}
              extraData={newsfeed.feedType}
            />
          </View>
        </RecommendationProvider>
      </ChannelRecommendationProvider>
      {showFAB && (
        <CaptureFab
          visible={true}
          navigation={navigation}
          style={composeFABStyle}
        />
      )}
    </Screen>
  );
});

const prefetch: NotificationsTabOptions[] = ['all'];
const RECOMMENDATION_TYPES: RecommendationType[] = ['group'];
const composeFABStyle = { bottom: 24 };

export default withErrorBoundary(NewsfeedScreen);
