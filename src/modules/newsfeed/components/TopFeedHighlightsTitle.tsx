import { observer } from 'mobx-react';
import React from 'react';

import { withErrorBoundary } from '~/common/components/ErrorBoundary';

import { Icon } from '~/common/ui';
import useDismissible from '~/services/hooks/useDismissable';
import NewsfeedHeader from '~/newsfeed/NewsfeedHeader';
import MenuSheet from '~/common/components/bottom-sheet/MenuSheet';
import sp from '~/services/serviceProvider';

const TopFeedHighlightsTitle = observer(() => {
  const { dismiss, isDismissed } = useDismissible('top-highlights');

  const sheetOptions = React.useMemo(
    () => [
      {
        title: sp.i18n.t('removeFromFeed'),
        onPress: dismiss,
        iconName: 'close',
        iconType: 'material-community',
      },
    ],
    [dismiss],
  );

  return isDismissed ? null : (
    <NewsfeedHeader
      title="Highlights"
      small
      endIcon={
        <MenuSheet items={sheetOptions}>
          <Icon name="more" size="large" left="M" />
        </MenuSheet>
      }
    />
  );
});

export default withErrorBoundary(TopFeedHighlightsTitle);
