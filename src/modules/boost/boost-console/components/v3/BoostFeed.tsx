import React from 'react';
import { FeedListProps } from '~/common/components/FeedListV2';
import type ActivityModel from '~/newsfeed/ActivityModel';
import { useInfiniteBoostFeed } from '../../hooks/useInfiniteBoostFeed';
import {
  FeedList,
  FeedListEmpty,
  FeedListFooter,
} from '~/modules/newsfeed/components/FeedList';
import { useMetadataService } from '~/services/hooks/useMetadataService';

type BoostFeedProps = Omit<FeedListProps<ActivityModel>, 'feedStore'>;
/**
 * Approved boost feed
 */
export default function BoostFeed(props: BoostFeedProps) {
  const { entities, refresh, query } = useInfiniteBoostFeed(1);
  const meta = useMetadataService('feed/boosts', 'featured-content');

  return (
    <FeedList
      emphasizeGroup
      data={entities}
      refreshing={query.isRefetching}
      onEndReached={query.fetchNextPage}
      // to avoid issues with the repeated keys in the for-you feed
      onItemViewed={(item, index) => {
        item.trackView?.(meta.getClientMetadata(item, undefined, index));
      }}
      onRefresh={refresh}
      keyExtractor={keyExtractor}
      ListEmptyComponent={query.isFetchedAfterMount ? <FeedListEmpty /> : null}
      ListFooterComponent={
        <FeedListFooter
          loading={query.isFetching}
          error={query.error}
          reload={query.fetchNextPage}
        />
      }
      {...props}
    />
  );
}

const keyExtractor = (_, index: any) => {
  return index.toString();
};
