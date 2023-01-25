import { observer } from 'mobx-react';
import React from 'react';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import i18n from '~/common/services/i18n.service';
import ThemedStyles from '~/styles/ThemedStyles';
import { useBoostConsoleStore } from '../contexts/boost-store.context';

interface BoostTabBarProps {}

function BoostTabBar({}: BoostTabBarProps) {
  const theme = ThemedStyles.style;
  const boostConsoleStore = useBoostConsoleStore();

  const tabs: Array<TabType<string>> = [
    {
      id: 'peer',
      title: i18n.t('boosts.tabOffers'),
    },
    {
      id: 'newsfeed',
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
