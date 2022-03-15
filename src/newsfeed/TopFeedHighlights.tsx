import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import FeedList from '~/common/components/FeedList';
import i18nService from '~/common/services/i18n.service';
import MetadataService from '~/common/services/metadata.service';
import FeedStore from '~/common/stores/FeedStore';
import { Button } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import NewsfeedHeader from './NewsfeedHeader';

const TopFeedHighlights = observer(({ onSeeTopFeedPress }) => {
  const feed = useRef(
    new FeedStore()
      .setEndpoint('api/v3/newsfeed/feed/unseen-top')
      .setInjectBoost(false)
      .setLimit(3)
      .setMetadata(
        new MetadataService()
          .setSource('feed/subscribed')
          .setMedium('top-feed'),
      ),
  ).current;
  const navigation = useNavigation();

  useEffect(() => {
    feed.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!feed.entities.length) {
    return null;
  }

  return (
    <>
      <NewsfeedHeader title="Highlights" />
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
          onPress={onSeeTopFeedPress}>
          {i18nService.t('newsfeed.seeMoreTopPosts')}
        </Button>
      </View>
    </>
  );
});

const moreTopPostsButtonStyle = ThemedStyles.combine({ marginTop: -22 });

export default withErrorBoundary(TopFeedHighlights);
