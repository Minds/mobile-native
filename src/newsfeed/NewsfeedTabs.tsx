import React, { useEffect } from 'react';
import TopbarTabbar from '~/common/components/topbar-tabbar/TopbarTabbar';
import type NewsfeedStore from './NewsfeedStore';
import i18n from '~/common/services/i18n.service';
import { observer } from 'mobx-react';
import { useIsFeatureOn } from 'ExperimentsProvider';
import { useLegacyStores } from '../common/hooks/use-stores';
import { NewsfeedType } from './NewsfeedStore';

function NewsfeedTabs({ newsfeed }: { newsfeed: NewsfeedStore }) {
  const experimentOn = useIsFeatureOn('mob-4938-newsfeed-for-you');
  const { groups } = useLegacyStores();

  const tabs = React.useMemo(
    () => {
      const _tabs: { id: NewsfeedType; title: string }[] = [
        { id: 'latest', title: i18n.t('newsfeed.latestPosts') },
        { id: 'top', title: i18n.t('newsfeed.topPosts') },
        { id: 'groups', title: i18n.t('newsfeed.groups') },
      ];

      if (experimentOn) {
        _tabs.unshift({
          id: 'for-you',
          title: i18n.t('newsfeed.foryouPosts'),
        });
      }

      return _tabs;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.locale, experimentOn],
  );

  useEffect(() => {
    if (!groups.loaded) {
      groups.loadList();
    }
  }, [groups]);

  return newsfeed.feedType ? (
    <TopbarTabbar
      current={newsfeed.feedType}
      onChange={tabId => {
        newsfeed.changeFeedType(tabId);
      }}
      tabs={tabs}
    />
  ) : null;
}

export default observer(NewsfeedTabs);
