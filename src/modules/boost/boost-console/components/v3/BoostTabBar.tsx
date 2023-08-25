import { observer } from 'mobx-react';
import React from 'react';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import { HairlineRow, Row } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../../locales';
import { useBoostConsoleStore } from '../../contexts/boost-store.context';
import FeedFilter from './FeedFilter';
import BoostLatestPostPrompt from './BoostLatestPostPrompt';
import BoostChannelPrompt from './BoostChannelPrompt';

interface BoostTabBarProps {}

function BoostTabBar({}: BoostTabBarProps) {
  const { t } = useTranslation();
  const theme = ThemedStyles.style;
  const boostConsoleStore = useBoostConsoleStore();

  const tabs: Array<TabType<string>> = [
    {
      id: 'feed',
      title: t('Posts'),
    },
    {
      id: 'sidebar',
      title: t('Channel + groups'),
    },
    {
      id: 'explore',
      title: t('Explore'),
    },
  ];

  return (
    <>
      <Row flex align="centerEnd">
        <TopbarTabbar
          titleStyle={theme.bold}
          tabs={tabs}
          onChange={boostConsoleStore.setFilter}
          current={boostConsoleStore.filter}
          containerStyle={styles.tabbar}
        />

        {boostConsoleStore.filter !== 'explore' && (
          <FeedFilter containerStyles={ThemedStyles.style.marginRight2x} />
        )}
      </Row>

      <HairlineRow />

      {boostConsoleStore.filter !== 'sidebar' ? (
        <BoostLatestPostPrompt />
      ) : (
        <BoostChannelPrompt />
      )}
    </>
  );
}

const styles = ThemedStyles.create({
  tabbar: { borderBottomWidth: 0, flex: 1 },
});

export default observer(BoostTabBar);
