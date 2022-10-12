import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import { useLegacyStores } from '~/common/hooks/use-stores';

import i18nService from '~/common/services/i18n.service';
import { Button } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import Activity from './activity/Activity';
import ActivityModel from './ActivityModel';

const TopFeedHighlights = observer(({ onSeeTopFeedPress }) => {
  const navigation = useNavigation();
  const { newsfeed, dismissal } = useLegacyStores();
  const isDismissed = dismissal.isDismissed('top-highlights');

  const shouldRender =
    Boolean(newsfeed.highlightsStore.entities.length) && isDismissed;

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {newsfeed.highlightsStore.entities.map(entity =>
        entity instanceof ActivityModel ? (
          <Activity
            entity={entity}
            navigation={navigation}
            key={`hl${entity.urn}`}
          />
        ) : null,
      )}
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
