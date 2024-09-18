import { observer } from 'mobx-react';
import React from 'react';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';

import { useBoostConsoleStore } from '../contexts/boost-store.context';
import sp from '~/services/serviceProvider';

interface BoostTabBarProps {}

function BoostTabBar({}: BoostTabBarProps) {
  const theme = sp.styles.style;
  const boostConsoleStore = useBoostConsoleStore();
  const i18n = sp.i18n;
  const tabs: Array<TabType<string>> = [
    {
      id: 'peer',
      title: i18n.t('boosts.tabOffers'),
    },
    {
      id: 'feed',
      title: i18n.t('boosts.tabNewsfeed'),
    },
    {
      id: 'content',
      title: i18n.t('boosts.tabSidebar'),
    },
  ];

  return (
    <TopbarTabbar
      titleStyle={theme.bold}
      tabs={tabs}
      onChange={boostConsoleStore.setFilter}
      current={boostConsoleStore.filter}
    />
  );
}

export default observer(BoostTabBar);
