import { observer } from 'mobx-react';
import React from 'react';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import ThemedStyles from '~/styles/ThemedStyles';
import { Row } from '~/common/ui';
import { useTranslation } from '../../../locales';
import { useBoostConsoleStore } from '../../contexts/boost-store.context';
import FeedFilter from './FeedFilter';

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
      id: 'sidebar',
      title: t('Sidebar'),
    },
  ];

  return (
    <Row flex align="centerEnd">
      <TopbarTabbar
        titleStyle={theme.bold}
        tabs={tabs}
        onChange={boostConsoleStore.setFilter}
        current={boostConsoleStore.filter}
        containerStyle={styles.tabbar}
      />

      <FeedFilter containerStyles={ThemedStyles.style.marginRight2x} />
    </Row>
  );
}

const styles = ThemedStyles.create({
  tabbar: { borderBottomWidth: 0, flex: 1 },
});

export default observer(BoostTabBar);
