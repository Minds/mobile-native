import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';

import { Button } from '~/common/ui';

import useDismissible from '~/services/hooks/useDismissable';
import sp from '~/services/serviceProvider';

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
          {sp.i18n.t('newsfeed.seeMoreTopPosts')}
        </Button>
      </View>
    );
  },
);

const moreTopPostsButtonStyle = sp.styles.combine({ marginTop: -22 });

export default withErrorBoundary(TopFeedHighlightsFooter);
