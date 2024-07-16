import React from 'react';
import TopbarTabbar from '~/common/components/topbar-tabbar/TopbarTabbar';
import type NewsfeedStore from './NewsfeedStore';
import { observer } from 'mobx-react';
import { NewsfeedType } from './NewsfeedStore';
import { IS_TENANT, NEWSFEED_FORYOU_ENABLED } from '~/config/Config';
import sp from '~/services/serviceProvider';

function NewsfeedTabs({ newsfeed }: { newsfeed: NewsfeedStore }) {
  const i18n = sp.i18n;
  const tabs = React.useMemo(
    () => {
      const _tabs: { id: NewsfeedType; title: string }[] = [
        { id: 'latest', title: i18n.t('newsfeed.latestPosts') },
        { id: 'top', title: i18n.t('newsfeed.topPosts') },
      ];

      if (!IS_TENANT) {
        _tabs.push({ id: 'groups', title: i18n.t('newsfeed.groups') });
      } else if (newsfeed.feedType === 'groups') {
        // check if a tenant app is already on the group tab and change it
        newsfeed.changeFeedType('latest');
      }

      if (NEWSFEED_FORYOU_ENABLED) {
        _tabs.unshift({
          id: 'for-you',
          title: i18n.t('newsfeed.foryouPosts'),
        });
      }

      return _tabs;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.locale],
  );

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
