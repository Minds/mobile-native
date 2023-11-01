import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import Topbar from '~/topbar/Topbar';

import type { AppStackParamList } from '~/navigation/NavigationTypes';
import type UserStore from '~/auth/UserStore';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import NewsfeedPlaceholder from '../components/NewsfeedPlaceholder';
import { Screen } from '~/common/ui';
import { useLegacyStores, useStores } from '~/common/hooks/use-stores';
import PrefetchNotifications from '~/notifications/v3/PrefetchNotifications';
import { IS_IOS } from '~/config/Config';
import { NotificationsTabOptions } from '~/notifications/v3/NotificationsTopBar';

import { useInfiniteNewsfeed } from '~/modules/newsfeed/hooks/useInfiniteNewsfeed';
import {
  FeedList,
  FeedListEmpty,
  FeedListFooter,
} from '../components/FeedList';
import StickyListWrapper from '~/common/components/StickyListWrapper';
import Animated from 'react-native-reanimated';
import CheckLanguage from '~/common/components/CheckLanguage';
import CodePushUpdatePrompt from '~/modules/codepush/widgets/CodePushUpdatePrompt';
import RemoteBanner from '~/common/components/RemoteBanner';
import InitialOnboardingButton from '~/onboarding/v2/InitialOnboardingButton';
import PortraitContentBar from '~/portrait/components/PortraitContentBar';
import NewsfeedTabs from '~/newsfeed/NewsfeedTabs';
import { useIsFeatureOn } from 'ExperimentsProvider';
import { InAppVerificationPrompt } from '~/modules/in-app-verification';
import SeeLatestPostsButton from '../components/SeeLatestPostsButton';
import type NewsfeedStore from '~/newsfeed/NewsfeedStore';
import useModelEvent from '~/common/hooks/useModelEvent';
import ActivityModel from '~/newsfeed/ActivityModel';
import { FlashList } from '@shopify/flash-list';
import { getNotice } from '~/common/components/in-feed-notices/notices';
import { B1 } from '../../../common/ui';
import Recommendation from '../components/Recommendation';
import TopFeedHighlights from '../components/TopFeedHighlights';
import CaptureFab from '~/capture/CaptureFab';

type NewsfeedScreenRouteProp = RouteProp<AppStackParamList, 'Newsfeed'>;
type NewsfeedScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Newsfeed'
>;

const AnimatedFeedList = Animated.createAnimatedComponent(FeedList);

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
const NewsfeedScreenCmp = observer(({ navigation }: NewsfeedScreenProps) => {
  const { newsfeed } = useLegacyStores();
  const portrait = useStores().portrait;

  const animatedScrollRef = React.useRef<any>(null);
  const feedListRef = React.useRef<FlashList<any>>(null);

  const isLatest = newsfeed.feedType === 'latest';

  const { query, entities, lastFetchAt, refresh, prepend } =
    useInfiniteNewsfeed(newsfeed.feedType);

  const refreshNewsfeed = useCallback(
    async (scrollAndRefresh = false) => {
      const position = animatedScrollRef.current?.getScrollPosition();
      if (position && position > 10 && !scrollAndRefresh) {
        feedListRef.current?.scrollToOffset({ offset: 0, animated: true });
      } else {
        if (scrollAndRefresh) {
          feedListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }

        await refresh();
        portrait.load();
      }
    },
    [portrait, refresh],
  );

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
    // newsfeed.loadFeed();

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
    }, 1500);
    return () => clearTimeout(t);
  }, [portrait]);

  useModelEvent(
    ActivityModel,
    'newPost',
    (entity: ActivityModel) => {
      prepend(entity);
    },
    [],
  );

  const refreshing = query.isLoading && query.isFetchedAfterMount; // listen to refetching

  /**
   * Render in feed components (Recommendation, TopFeedHighlights)
   */
  const renderInFeedItems = useCallback(
    row =>
      row.item.__typename === 'FeedNoticeNode' ? (
        getNotice(row.item.key)
      ) : row.item.__typename === 'PublisherRecsConnection' ? (
        <Recommendation
          type="channel"
          location="feed"
          entities={row.item.edges}
        />
      ) : row.item.__typename === 'FeedHighlightsConnection' ? (
        <TopFeedHighlights
          entities={row.item.edges}
          onSeeTopFeedPress={() => {
            feedListRef.current?.scrollToOffset({ offset: 0, animated: true });
            setTimeout(() => {
              newsfeed.changeFeedType('top');
            }, 500);
          }}
        />
      ) : __DEV__ ? (
        <B1>
          Item renderer missing
          {JSON.stringify(row.item.id) + console.log(row.item.id)}
        </B1>
      ) : null,
    [newsfeed],
  );

  const renderList = useCallback(
    p => (
      <AnimatedFeedList
        ref={feedListRef}
        overrideItemLayout={overrideItemLayout}
        emphasizeGroup
        renderInFeedItems={renderInFeedItems}
        data={entities}
        refreshing={refreshing}
        onEndReached={query.fetchNextPage}
        onItemViewed={(item, index) => {
          item.trackView?.(
            newsfeed.meta.getClientMetadata(item, undefined, index),
          );
        }}
        onRefresh={() => {
          refresh();
          portrait.load();
        }}
        ListEmptyComponent={
          !query.isError ? (
            <FeedListEmpty
              showPlaceholder={!query.isFetchedAfterMount}
              Placeholder={NewsfeedPlaceholder}
            />
          ) : null
        }
        ListFooterComponent={
          <FeedListFooter
            loading={query.isFetchingNextPage}
            error={query.error}
            reload={query.fetchNextPage}
          />
        }
        ListHeaderComponent={Header}
        extraData={newsfeed.feedType}
        {...p}
      />
    ),
    [
      entities,
      newsfeed.feedType,
      newsfeed.meta,
      portrait,
      query.error,
      query.fetchNextPage,
      query.isError,
      query.isFetchedAfterMount,
      query.isFetchingNextPage,
      refresh,
      refreshing,
      renderInFeedItems,
    ],
  );

  return (
    <Screen safe onlyTopEdge={IS_IOS}>
      <PrefetchNotifications tabs={prefetch} />

      <StickyListWrapper
        ref={animatedScrollRef}
        bottomComponent={
          isLatest ? (
            <SeeLatestPostsButton
              lastFetch={lastFetchAt}
              countEndpoint="api/v3/newsfeed/subscribed/latest/count"
              onPress={() => refreshNewsfeed(true)}
            />
          ) : undefined
        }
        header={<Topbar noInsets navigation={navigation} />}
        renderList={renderList}
      />
      <CaptureFab
        visible={true}
        navigation={navigation}
        style={composeFABStyle}
      />
    </Screen>
  );
});

const Header = () => (
  <>
    <CheckLanguage />
    <CodePushUpdatePrompt>
      <RemoteBanner />
    </CodePushUpdatePrompt>
    <InitialOnboardingButton />
    <PortraitContentBar />
    {useIsFeatureOn('mob-4472-in-app-verification') ? (
      <InAppVerificationPrompt />
    ) : null}
    <NewsfeedTabs newsfeed={useLegacyStores().newsfeed} />
  </>
);

const prefetch: NotificationsTabOptions[] = ['all'];
const composeFABStyle = { bottom: 24 };

export const NewsfeedScreen = withErrorBoundary(NewsfeedScreenCmp);
