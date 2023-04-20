import { observer } from 'mobx-react';
import React from 'react';
import BaseNotice from '~/common/components/in-feed-notices/notices/BaseNotice';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import sessionService from '~/common/services/session.service';
import { HairlineRow, Row } from '~/common/ui';
import NavigationService from '~/navigation/NavigationService';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../../locales';
import { useBoostConsoleStore } from '../../contexts/boost-store.context';
import FeedFilter from './FeedFilter';
import apiService from '~/common/services/api.service';
import ActivityModel from '~/newsfeed/ActivityModel';
import { showNotification } from '../../../../../../AppMessages';

interface BoostTabBarProps {}

function BoostTabBar({}: BoostTabBarProps) {
  const { t } = useTranslation();
  const theme = ThemedStyles.style;
  const boostConsoleStore = useBoostConsoleStore();

  const tabs: Array<TabType<string>> = [
    {
      id: 'feed',
      title: t('Feed'),
    },
    {
      id: 'sidebar',
      title: t('Sidebar'),
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

        <FeedFilter containerStyles={ThemedStyles.style.marginRight2x} />
      </Row>

      <HairlineRow />

      {boostConsoleStore.filter === 'feed' ? (
        <BoostPostNotice />
      ) : (
        <BoostChannelNotice />
      )}
    </>
  );
}

const BoostPostNotice = () => {
  const user = sessionService.getUser();
  const { t } = useTranslation();

  const boostLatestPost = async () => {
    const response = await apiService.get<any>(
      `api/v2/feeds/container/${user.guid}/activities?sync=1&limit=12&as_activities=1&export_user_counts=0&unseen=false`,
    );

    if (!response?.entities.length) {
      showNotification('No posts found', 'warning');
      return;
    }

    const sortedEntitesByTimeCreated = response?.entities.sort((a, b) => {
      if (Number(a.entity.time_created) > Number(b.entity.time_created)) {
        return -1;
      }

      if (Number(a.entity.time_created) < Number(b.entity.time_created)) {
        return 1;
      }

      return 0;
    });

    const latestPost = ActivityModel.create(sortedEntitesByTimeCreated[0]);

    return NavigationService.navigate('BoostScreenV2', {
      entity: latestPost,
    });
  };

  return (
    <BaseNotice
      dismissable={false}
      borderless
      title={t('Create a Boosted Post')}
      btnText={t('Create Boost')}
      description={t(
        'Get even more reach and engagement now by boosting your post.',
      )}
      iconName="boost"
      onPress={boostLatestPost}
    />
  );
};

const BoostChannelNotice = () => {
  const user = sessionService.getUser();
  const { t } = useTranslation();

  return (
    <BaseNotice
      dismissable={false}
      borderless
      title={t('Boost your channel')}
      btnText={t('Boost Channel')}
      description={t(
        'Get even more reach and engagement now by boosting your channel.',
      )}
      iconName="boost"
      onPress={() =>
        NavigationService.navigate('BoostScreenV2', {
          entity: user,
          boostType: 'channel',
        })
      }
    />
  );
};

const styles = ThemedStyles.create({
  tabbar: { borderBottomWidth: 0, flex: 1 },
});

export default observer(BoostTabBar);
