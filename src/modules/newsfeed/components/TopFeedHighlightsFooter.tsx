import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';

import i18n from '~/common/services/i18n.service';
import { Button } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import useDismissible from '~/services/hooks/useDismissable';

const TopFeedHighlightsFooter = observer(
  ({ onSeeTopFeedPress }: { onSeeTopFeedPress: () => void }) => {
    const { isDismissed } = useDismissible('top-highlights');

    if (isDismissed) {
      return null;
    }

    return (
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
    );
  },
);

const moreTopPostsButtonStyle = ThemedStyles.combine({ marginTop: -22 });

export default withErrorBoundary(TopFeedHighlightsFooter);
