import React from 'react';
import { observer } from 'mobx-react-lite';
import NewsfeedHeader from './NewsfeedHeader';
import { useLegacyStores } from '~/common/hooks/use-stores';
import FeedListInvisibleHeader from '~/common/components/FeedListInvisibleHeader';

export default observer(function TopFeedHighlightsHeader({
  target,
}: {
  target: string;
}) {
  const { newsfeed } = useLegacyStores();
  return newsfeed.highlightsStore.entities.length ? (
    <NewsfeedHeader
      title="Highlights"
      small
      shadow={target === 'StickyHeader'}
    />
  ) : (
    <FeedListInvisibleHeader />
  );
});
