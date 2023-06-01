import React from 'react';
import TopbarTabbar from '~/common/components/topbar-tabbar/TopbarTabbar';
import type NewsfeedStore from './NewsfeedStore';
import i18n from '~/common/services/i18n.service';
import { observer } from 'mobx-react';
import { useIsFeatureOn } from 'ExperimentsProvider';
import { NewsfeedType } from './NewsfeedStore';
import type BaseModel from '~/common/BaseModel';

function NewsfeedTabs({ newsfeed }: { newsfeed: NewsfeedStore<BaseModel> }) {
  const experimentOn = useIsFeatureOn('mob-4938-newsfeed-for-you');
  const tabs = React.useMemo(
    () =>
      (experimentOn
        ? [
            { id: 'foryou', title: i18n.t('newsfeed.foryouPosts') },
            { id: 'latest', title: i18n.t('newsfeed.latestPosts') },
            { id: 'top', title: i18n.t('newsfeed.topPosts') },
            { id: 'groups', title: i18n.t('newsfeed.topPosts') },
          ]
        : [
            { id: 'latest', title: i18n.t('newsfeed.latestPosts') },
            { id: 'top', title: i18n.t('newsfeed.topPosts') },
            { id: 'groups', title: i18n.t('newsfeed.topPosts') },
          ]) as { id: NewsfeedType; title: string }[],
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
