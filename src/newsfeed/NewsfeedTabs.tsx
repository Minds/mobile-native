import React, { useEffect } from 'react';
import TopbarTabbar from '~/common/components/topbar-tabbar/TopbarTabbar';
import type NewsfeedStore from './NewsfeedStore';
import i18n from '~/common/services/i18n.service';
import { observer } from 'mobx-react';
import { useIsFeatureOn } from 'ExperimentsProvider';
import type BaseModel from '~/common/BaseModel';
import { useLegacyStores } from '../common/hooks/use-stores';
import { NewsfeedType } from './NewsfeedStore';

function NewsfeedTabs({ newsfeed }: { newsfeed: NewsfeedStore<BaseModel> }) {
  const experimentOn = useIsFeatureOn('mob-4938-newsfeed-for-you');
  const { groups } = useLegacyStores();
  const hasGroups = !!groups.list.entities.length;

  const tabs = React.useMemo(
    () => {
      const _tabs: { id: NewsfeedType; title: string }[] = [
        { id: 'latest', title: i18n.t('newsfeed.latestPosts') },
        { id: 'top', title: i18n.t('newsfeed.topPosts') },
      ];

      if (experimentOn) {
        _tabs.unshift({
          id: 'foryou',
          title: i18n.t('newsfeed.foryouPosts'),
        });
      }

      if (hasGroups) {
        _tabs.push({ id: 'groups', title: i18n.t('newsfeed.groups') });
      }

      return _tabs;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.locale, hasGroups, experimentOn],
  );

  useEffect(() => {
    groups.loadList();
  }, [groups]);

  /**
   * Change the tab to the first tab if we were on the groups tab and user leaves all groups
   */
  useEffect(() => {
    if (!hasGroups && newsfeed.feedType === 'groups') {
      newsfeed.changeFeedType(tabs[0].id);
    }
  }, [hasGroups, newsfeed, tabs]);

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
