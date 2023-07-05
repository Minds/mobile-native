import React, { useCallback, useEffect, useState } from 'react';

import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { AnimatePresence } from 'moti';

import i18n from '../../common/services/i18n.service';

import ThemedStyles from '../../styles/ThemedStyles';
import { useDiscoveryV2Store } from './useDiscoveryV2Store';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import { InjectItem } from '../../common/components/FeedList';
import type FeedList from '../../common/components/FeedList';
import InitialOnboardingButton from '../../onboarding/v2/InitialOnboardingButton';
import DiscoveryTabContent from './DiscoveryTabContent';
import Topbar from '~/topbar/Topbar';
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import FeedListSticky from '~/common/components/FeedListSticky';
import { Screen } from '~/common/ui';
import { IS_IOS } from '~/config/Config';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { DiscoveryStackScreenProps } from '~/navigation/DiscoveryStack';
import OffsetList from '../../common/components/OffsetList';
import ChannelListItem from '../../common/components/ChannelListItem';
import UserModel from '../../channel/UserModel';
import GroupsListItem from '../../groups/GroupsListItem';
import GroupModel from '../../groups/GroupModel';

type Props = DiscoveryStackScreenProps<'Discovery'>;

/**
 * Discovery Feed Screen
 */
export const DiscoveryV2Screen = withErrorBoundaryScreen(
  observer((props: Props) => {
    const [shouldRefreshOnTabPress, setShouldRefreshOnTabPress] =
      useState(false);
    const store = useDiscoveryV2Store();
    const listRef = React.useRef<FeedList<any>>(null);
    const channelsListRef = React.useRef<any>(null);
    const groupsListRef = React.useRef<any>(null);
    const tab = props.route.params?.tab;

    // inject items in the store the first time
    if (!store.trendingFeed.injectItems) {
      store.trendingFeed.setInjectedItems([
        new InjectItem(0, 'tags', () => (
          <DiscoveryTagsList
            type="trending"
            store={store}
            style={styles.bottomBorder}
            showManageTags={false}
          />
        )),
      ]);

      store.topFeed.setInjectedItems([
        new InjectItem(2, 'reco', () => (
          <ChannelRecommendation location="discovery-feed" />
        )),
      ]);
    }

    const navigation = props.navigation;

    const tabs = React.useMemo(
      () =>
        [
          { id: 'top', title: i18n.t('discovery.top') },
          { id: 'trending-tags', title: i18n.t('discovery.trending') },
          { id: 'channels', title: 'Channels' },
          { id: 'groups', title: 'Groups' },
        ].filter(Boolean) as { id: string; title: string }[],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [i18n.locale],
    );

    const header = (
      <View style={styles.header}>
        <InitialOnboardingButton />
        <TopbarTabbar
          current={store.activeTabId}
          onChange={tabId => {
            store.setTabId(tabId as TDiscoveryV2Tabs);
          }}
          tabs={tabs}
        />
      </View>
    );

    useEffect(() => {
      const unsubscribe = navigation
        .getParent()
        //@ts-ignore
        ?.addListener('tabPress', () => {
          if (shouldRefreshOnTabPress) {
            listRef.current?.scrollToOffset({ offset: 0 });
            switch (tab) {
              case 'channels':
                channelsListRef?.current?.refreshList();
                break;
              case 'groups':
                groupsListRef?.current?.refreshList();
                break;
            }
            store.refreshActiveTab();
          }
        });
      return unsubscribe;
    }, [
      store,
      navigation,
      shouldRefreshOnTabPress,
      channelsListRef,
      groupsListRef,
      tab,
    ]);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setShouldRefreshOnTabPress(true);
      });
      return unsubscribe;
    }, [store, navigation]);

    useEffect(() => {
      const unsubscribe = navigation.addListener('blur', () => {
        setShouldRefreshOnTabPress(false);
      });
      return unsubscribe;
    }, [store, navigation]);

    useEffect(() => {
      store.topFeed.fetchLocalOrRemote();
      if (tab) {
        store.setTabId(tab);
        switch (tab) {
          case 'channels':
            channelsListRef?.current?.refreshList();
            break;
          case 'groups':
            groupsListRef?.current?.refreshList();
            break;
        }
      }
    }, [store, tab]);

    useFocusEffect(
      useCallback(() => {
        store.clearBadge();
      }, [store]),
    );

    const screen = () => {
      switch (store.activeTabId) {
        case 'top':
          return (
            <DiscoveryTabContent key="top">
              <FeedListSticky
                ref={listRef}
                header={header}
                feedStore={store.topFeed}
              />
            </DiscoveryTabContent>
          );
        case 'trending-tags':
          return (
            <DiscoveryTabContent key="trending-tags">
              <FeedListSticky
                ref={listRef}
                header={header}
                feedStore={store.trendingFeed}
              />
            </DiscoveryTabContent>
          );
        case 'channels':
          return (
            <DiscoveryTabContent key="channels">
              <OffsetList
                ref={channelsListRef}
                sticky
                fetchEndpoint="api/v3/subscriptions/relational/subscriptions-of-subscriptions"
                endpointData="users"
                header={header}
                offsetPagination
                renderItem={({ item }) => (
                  <ChannelListItem
                    channel={UserModel.checkOrCreate(item)}
                    borderless
                    navigation={navigation}
                  />
                )}
              />
            </DiscoveryTabContent>
          );
        case 'groups':
          return (
            <DiscoveryTabContent key="groups">
              <OffsetList
                ref={groupsListRef}
                sticky
                fetchEndpoint="api/v2/suggestions/group"
                endpointData="suggestions"
                header={header}
                offsetPagination
                renderItem={({ item }) => (
                  <GroupsListItem
                    group={GroupModel.checkOrCreate(item.entity)}
                  />
                )}
              />
            </DiscoveryTabContent>
          );
        default:
          return <View key="none" />;
      }
    };

    return (
      <Screen safe onlyTopEdge={IS_IOS}>
        <View style={ThemedStyles.style.flexContainer}>
          <Topbar
            title="Discovery"
            navigation={navigation}
            noInsets
            shadowLess
          />
          <AnimatePresence>{screen()}</AnimatePresence>
        </View>
      </Screen>
    );
  }),
  'DiscoveryV2Screen',
);

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
  header: ['bgPrimaryBackground', 'paddingTop', 'fullWidth', 'marginTopXXXL2'],
  bottomBorder: ['bcolorPrimaryBorder', 'borderBottom4x'],
});
