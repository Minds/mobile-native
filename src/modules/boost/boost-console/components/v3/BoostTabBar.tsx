import { observer } from 'mobx-react';
import React from 'react';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import { HairlineRow, Row } from '~/common/ui';

import { useTranslation } from '../../../locales';
import { useBoostConsoleStore } from '../../contexts/boost-store.context';
import FeedFilter from './FeedFilter';
import BoostLatestPostPrompt from './BoostLatestPostPrompt';
import BoostChannelPrompt from './BoostChannelPrompt';
import { IS_TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

interface BoostTabBarProps {}

function BoostTabBar({}: BoostTabBarProps) {
  const { t } = useTranslation();
  const theme = sp.styles.style;
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

  const prompt = IS_TENANT ? null : boostConsoleStore.filter !== 'sidebar' ? (
    <BoostLatestPostPrompt />
  ) : (
    <BoostChannelPrompt />
  );

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
          <FeedFilter containerStyles={sp.styles.style.marginRight2x} />
        )}
      </Row>

      <HairlineRow />
      {prompt}
    </>
  );
}

const styles = sp.styles.create({
  tabbar: { borderBottomWidth: 0, flex: 1 },
});

export default observer(BoostTabBar);
