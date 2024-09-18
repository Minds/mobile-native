import React, { FC, useEffect, useRef } from 'react';
import FeedList from '~/common/components/FeedList';
import FeedStore from '~/common/stores/FeedStore';
import Topbar from '~/topbar/Topbar';
import sp from '~/services/serviceProvider';
import { useMetadataService } from '~/services/hooks/useMetadataService';

const TopNewsfeedScreen: FC<any> = ({ navigation }) => {
  const feedStore = useTopFeed();
  return (
    <>
      <Topbar
        navigation={navigation}
        title={sp.i18n.t('newsfeed.topPosts')}
        showBack
      />
      <FeedList feedStore={feedStore} navigation={navigation} />
    </>
  );
};

const useTopFeed = () => {
  const metadata = useMetadataService('top-feed', 'feed');
  const feedStore = useRef(
    new FeedStore()
      .setEndpoint('api/v3/newsfeed/feed/unseen-top')
      .setInjectBoost(true)
      .setLimit(12)
      .setMetadata(metadata),
  ).current;

  useEffect(() => {
    feedStore.fetch(false, true);
  });

  return feedStore;
};

export default TopNewsfeedScreen;
