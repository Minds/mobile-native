import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';

import i18n from '~/common/services/i18n.service';
import { Button, Icon } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import useDismissible from '~/services/hooks/useDismissable';
import NewsfeedHeader from '~/newsfeed/NewsfeedHeader';
import MenuSheet from '~/common/components/bottom-sheet/MenuSheet';
import { useIsFeatureOn } from 'ExperimentsProvider';
import ActivityModel from '~/newsfeed/ActivityModel';
import Activity from '~/newsfeed/activity/Activity';

const TopFeedHighlights = observer(
  ({
    onSeeTopFeedPress,
    entities,
  }: {
    entities: ActivityModel[];
    onSeeTopFeedPress: () => void;
  }) => {
    const navigation = useNavigation();
    const hidePostFeature = useIsFeatureOn('mob-5075-hide-post-on-downvote');
    const { isDismissed, dismiss } = useDismissible('top-highlights');

    const shouldRender = Boolean(entities.length) && !isDismissed;

    const sheetOptions = React.useMemo(
      () => [
        {
          title: i18n.t('removeFromFeed'),
          onPress: () => dismiss,
          iconName: 'close',
          iconType: 'material-community',
        },
      ],
      [dismiss],
    );

    if (!shouldRender) {
      return null;
    }

    return (
      <>
        <NewsfeedHeader
          title="Highlights"
          small
          endIcon={
            <MenuSheet items={sheetOptions}>
              <Icon name="more" size="large" left="M" />
            </MenuSheet>
          }
        />
        {entities.map((entity, i) =>
          entity instanceof ActivityModel ? (
            <Activity
              entity={entity}
              navigation={navigation}
              key={`hl${entity.urn}`}
              explicitVoteButtons={i === 1}
              hidePostOnDownvote={hidePostFeature}
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
            {i18n.t('newsfeed.seeMoreTopPosts')}
          </Button>
        </View>
      </>
    );
  },
);

const moreTopPostsButtonStyle = ThemedStyles.combine({ marginTop: -22 });

export default withErrorBoundary(TopFeedHighlights);
