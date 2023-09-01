import React, { useEffect } from 'react';
import useFeedStore from '~/common/hooks/useFeedStore';
import { FeedListProps, FeedListV2 } from '~/common/components/FeedListV2';
import type ActivityModel from '~/newsfeed/ActivityModel';

type BoostFeedProps = Omit<FeedListProps<ActivityModel>, 'feedStore'>;

/**
 * Approved boost feed
 */
export default function BoostFeed(props: BoostFeedProps) {
  const feedStore = useFeedStore(true);

  feedStore
    .getMetadataService()!
    .setSource('feed/boosts')
    .setMedium('featured-content');

  feedStore
    .setEndpoint('api/v3/boosts/feed')
    .setInjectBoost(false)
    .feedsService.setDataProperty('boosts')
    .setParams(params);
  // .setLimit(12);

  useEffect(() => {
    feedStore.fetch();
  }, [feedStore]);

  return <FeedListV2 feedStore={feedStore} {...props} />;
}

const params = { location: 1 };
