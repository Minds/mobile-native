import React from 'react';
import { observer } from 'mobx-react-lite';
import NewsfeedHeader from './NewsfeedHeader';
import { useLegacyStores } from '~/common/hooks/use-stores';
import FeedListInvisibleHeader from '~/common/components/FeedListInvisibleHeader';
import MenuSheet from '../common/components/bottom-sheet/MenuSheet';
import { Icon } from '../common/ui';
import i18n from '../common/services/i18n.service';

export default observer(function TopFeedHighlightsHeader({
  target,
}: {
  target?: string;
}) {
  const { newsfeed, dismissal } = useLegacyStores();
  const shouldRender = !dismissal.isDismissed('top-highlights');
  const sheetOptions = React.useMemo(
    () => [
      {
        title: i18n.t('removeFromFeed'),
        onPress: () => dismissal.dismiss('top-highlights'),
        iconName: 'close',
        iconType: 'material-community',
      },
    ],
    [dismissal],
  );

  if (!shouldRender) {
    return null;
  }

  return newsfeed.highlightsStore.entities.length ? (
    <NewsfeedHeader
      title="Highlights"
      small
      shadow={target === 'StickyHeader'}
      endIcon={
        <MenuSheet items={sheetOptions}>
          <Icon name="more" size="large" left="M" />
        </MenuSheet>
      }
    />
  ) : (
    <FeedListInvisibleHeader />
  );
});
