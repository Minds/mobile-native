import React, { useCallback, useMemo } from 'react';
import Animated from 'react-native-reanimated';

import StickyListWrapper from '~/common/components/StickyListWrapper';
import { getNotice } from '~/common/components/in-feed-notices/notices';
import { B1 } from '~/common/ui';
import {
  SearchFilterEnum,
  SearchMediaTypeEnum,
  useInfiniteFetchSearchQuery,
} from '~/graphql/api';
import {
  FeedList,
  FeedListEmpty,
  FeedListFooter,
} from '~/modules/newsfeed/components/FeedList';
import NewsfeedPlaceholder from '~/modules/newsfeed/components/NewsfeedPlaceholder';
import Recommendation from '~/modules/newsfeed/components/Recommendation';
import { mapModels } from '~/modules/newsfeed/hooks/useInfiniteNewsfeed';
import { useMetadataService } from '~/services/hooks/useMetadataService';

const AnimatedFeedList = Animated.createAnimatedComponent(FeedList);

export default function TrendingList({ header }) {
  const query = useInfiniteTrendingQuery();
  const meta = useMetadataService('feed/discovery/search', 'feed');

  const onItemViewed = useCallback(
    (item, index) => {
      item.trackView?.(meta.getClientMetadata(item, undefined, index));
    },
    [meta],
  );

  return (
    <StickyListWrapper
      data={query.entities}
      header={header}
      renderInFeedItems={renderInFeedItems}
      refreshing={query.isRefetching}
      onEndReached={query.fetchNextPage}
      onItemViewed={onItemViewed}
      onRefresh={query.refetch}
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
      renderList={renderList}
    />
  );
}

function useInfiniteTrendingQuery() {
  const query = useInfiniteFetchSearchQuery(
    'cursor',
    {
      filter: SearchFilterEnum.Top,
      limit: 12,
      cursor: null,
      mediaType: SearchMediaTypeEnum.All,
      nsfw: [],
      query: '',
    },
    {
      getNextPageParam: lastPage => {
        const { endCursor, hasNextPage } = lastPage.search.pageInfo ?? {};
        return hasNextPage
          ? {
              cursor: endCursor,
            }
          : undefined;
      },
    },
  );

  // flatten and map to models
  const entities = useMemo(() => {
    return query.data?.pages.flatMap(page =>
      page.search.edges.map(e => mapModels(e)),
    );
  }, [query.data]);

  return { ...query, entities };
}

const renderInFeedItems = row => {
  switch (row.item.__typename) {
    case 'FeedNoticeNode':
      return getNotice(row.item.key);
    case 'PublisherRecsConnection':
      return (
        <Recommendation
          type="channel"
          location="feed"
          entities={row.item.edges}
        />
      );

    default:
      if (__DEV__) {
        console.log('Missing item renderer', row.item.__typename, row);
        return (
          <B1>
            Item renderer missing
            {JSON.stringify(row.item.__typename)}
          </B1>
        );
      } else {
        return null;
      }
  }
};

const renderList = p => <AnimatedFeedList emphasizeGroup {...p} />;
