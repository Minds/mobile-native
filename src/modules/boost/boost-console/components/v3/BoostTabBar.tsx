import { observer } from 'mobx-react';
import React from 'react';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../../locales';
import { useBoostConsoleStore } from '../../contexts/boost-store.context';

interface BoostTabBarProps {}

function BoostTabBar({}: BoostTabBarProps) {
  const { t } = useTranslation();
  const theme = ThemedStyles.style;
  const boostConsoleStore = useBoostConsoleStore();

  const tabs: Array<TabType<string>> = [
    {
      id: 'newsfeed',
      title: t('Feed'),
    },
    {
      id: 'content',
      title: t('Sidebar'),
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
