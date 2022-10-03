import React, { useCallback, useMemo } from 'react';
import OffsetList from '~/common/components/OffsetList';

import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import i18n from '~/common/services/i18n.service';

import { IconButton, Screen, ScreenHeader } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import FeedStore from '../common/stores/FeedStore';
import SeeLatestPostsButton from '../newsfeed/SeeLatestPostsButton';
import AddBankInformation from './AddBankInformation';
import SupermindRequest from './SupermindRequest';
import SupermindRequestModel from './SupermindRequestModel';

type TabModeType = 'inbound' | 'outbound';

export default function SupermindConsoleScreen({ navigation }) {
  const theme = ThemedStyles.style;
  const [mode, setMode] = React.useState<TabModeType>('inbound');
  const listRef = React.useRef<any>(null);
  const feedStore = useMemo(() => {
    const _feedStore = new FeedStore().setCountEndpoint(
      'api/v3/newsfeed/subscribed/latest/count',
    );
    _feedStore.feedsService.feedLastFetchedAt = Date.now();
    return _feedStore;
  }, []);
  const tabs: Array<TabType<TabModeType>> = React.useMemo(
    () => [
      {
        id: 'inbound',
        title: i18n.t('inbound'),
      },
      {
        id: 'outbound',
        title: i18n.t('outbound'),
      },
    ],
    [],
  );

  const scrollToTopAndRefresh = useCallback(() => {
    listRef.current?.scrollToTop();
    listRef.current?.refreshList();
  }, [listRef]);

  return (
    <Screen safe>
      <ScreenHeader
        title="Supermind"
        onTitlePress={scrollToTopAndRefresh}
        extra={
          <IconButton
            name="settings"
            onPress={() => navigation.navigate('SupermindSettingsScreen')}
          />
        }
        back
        shadow
      />
      <OffsetList
        ref={listRef}
        header={
          <>
            <TopbarTabbar
              titleStyle={theme.fontXL}
              tabs={tabs}
              onChange={setMode}
              current={mode}
              tabStyle={theme.paddingVertical}
            />
            <AddBankInformation />
          </>
        }
        contentContainerStyle={ThemedStyles.style.paddingTop2x}
        map={mapRequests}
        fetchEndpoint={
          mode === 'inbound'
            ? 'api/v3/supermind/inbox'
            : 'api/v3/supermind/outbox'
        }
        offsetPagination
        renderItem={
          mode === 'inbound' ? renderSupermindInbound : renderSupermindOutbound
        }
        endpointData=""
        onRefresh={feedStore.refreshNewPostsCount}
      />
      <SeeLatestPostsButton
        feedStore={feedStore}
        onPress={scrollToTopAndRefresh}
      />
    </Screen>
  );
}

const renderSupermindInbound = row => <SupermindRequest request={row.item} />;
const renderSupermindOutbound = row => (
  <SupermindRequest request={row.item} outbound />
);
const mapRequests = items => SupermindRequestModel.createMany(items);
