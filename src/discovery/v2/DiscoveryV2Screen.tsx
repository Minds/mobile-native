import React, { useCallback, useEffect, useState } from 'react';

import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { AnimatePresence } from 'moti';

import { useDiscoveryV2Store } from './useDiscoveryV2Store';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import { InjectItem } from '../../common/components/FeedListInjectedItem';
import InitialOnboardingButton from '../../onboarding/v2/InitialOnboardingButton';
import DiscoveryTabContent from './DiscoveryTabContent';
import Topbar from '~/topbar/Topbar';
import FeedListSticky, {
  FeedListStickyType,
} from '~/common/components/FeedListSticky';
import { Screen } from '~/common/ui';
import { IS_IOS, IS_IPAD, IS_TENANT } from '~/config/Config';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { DiscoveryStackScreenProps } from '~/navigation/DiscoveryStack';
import OffsetList from '../../common/components/OffsetList';
import ChannelListItem from '../../common/components/ChannelListItem';
import UserModel from '../../channel/UserModel';
import GroupsListItem from '../../groups/GroupsListItem';
import GroupModel from '../../groups/GroupModel';
import Empty from '~/common/components/Empty';
import Button from '~/common/components/Button';
import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import CaptureFab from '~/capture/CaptureFab';
import { EmptyMessage } from './EmptyMessage';
import { copyReferrer } from '~/modules/affiliate/components/LinksMindsSheet';
import TrendingList from './trending/TrendingList';
import sp from '~/services/serviceProvider';

type Props = DiscoveryStackScreenProps<'Discovery'>;

/**
 * Discovery Feed Screen
 */
export const DiscoveryV2Screen = withErrorBoundaryScreen(
  observer((props: Props) => {
    const [shouldRefreshOnTabPress, setShouldRefreshOnTabPress] =
      useState(false);
    const store = useDiscoveryV2Store();
    const listRef = React.useRef<React.ElementRef<FeedListStickyType>>(null);
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
    }

    const navigation = props.navigation;
    const i18n = sp.i18n;
    const tabs = React.useMemo(
      () => {
        return [
          IS_TENANT
            ? { id: 'latest', title: i18n.t('discovery.latest') }
            : null,
          { id: 'top', title: i18n.t('discovery.topV2') },
          { id: 'trending-tags', title: i18n.t('discovery.trendingV2') },
          { id: 'channels', title: 'Channels' },
          { id: 'groups', title: 'Groups' },
        ].filter(Boolean) as { id: string; title: string }[];
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [i18n.locale],
    );

    const emptyBoosts = React.useMemo(
      () => (
        <Empty
          title={i18n.t('boosts.emptyList')}
          subtitle={i18n.t('boosts.emptyListSubtitle')}>
          <Button
            onPress={() =>
              navigation.navigate('More', {
                screen: 'BoostSettingsScreen',
                initial: false,
              })
            }
            text={i18n.t('moreScreen.settings')}
            large
            action
          />
        </Empty>
      ),
      [i18n, navigation],
    );

    const header = (
      <View style={styles.header}>
        {!IS_TENANT && <InitialOnboardingButton />}
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
      const emptyMessageComponent = emptyMessage(store.activeTabId);
      switch (store.activeTabId) {
        case 'latest':
          return (
            <DiscoveryTabContent key="latest">
              <FeedListSticky
                ref={listRef}
                header={header}
                feedStore={store.latestFeed}
              />
            </DiscoveryTabContent>
          );
        case 'top':
          return (
            <DiscoveryTabContent key="top">
              <TrendingList header={header} />
            </DiscoveryTabContent>
          );
        case 'foryou':
          return (
            <DiscoveryTabContent key="foryou">
              <DiscoveryTrendsList store={store} header={header} />
            </DiscoveryTabContent>
          );
        case 'your-tags':
          return (
            <DiscoveryTabContent key="your-tags">
              <DiscoveryTagsList type="your" store={store} header={header} />
            </DiscoveryTabContent>
          );
        case 'trending-tags':
          return (
            <DiscoveryTabContent key="trending-tags">
              <FeedListSticky
                ref={listRef}
                header={header}
                feedStore={store.trendingFeed}
                emptyMessage={emptyMessageComponent()}
              />
            </DiscoveryTabContent>
          );
        case 'supermind':
          return (
            <DiscoveryTabContent key="supermind">
              <FeedListSticky
                ref={listRef}
                header={header}
                feedStore={store.supermindsFeed}
                emptyMessage={emptyBoosts}
              />
            </DiscoveryTabContent>
          );
        case 'channels':
          return (
            <DiscoveryTabContent key="channels">
              <OffsetList
                ref={channelsListRef}
                sticky
                fetchEndpoint={
                  IS_TENANT
                    ? 'api/v3/multi-tenant/lists/user'
                    : 'api/v3/subscriptions/relational/subscriptions-of-subscriptions'
                }
                endpointData={IS_TENANT ? 'data' : 'users'}
                header={header}
                offsetPagination
                renderItem={({ item }) => (
                  <ChannelListItem
                    channel={UserModel.checkOrCreate(
                      IS_TENANT ? item.entity : item,
                    )}
                    borderless
                    navigation={navigation}
                  />
                )}
                ListEmptyComponent={emptyMessageComponent(copyReferrer)}
              />
            </DiscoveryTabContent>
          );
        case 'groups':
          return (
            <DiscoveryTabContent key="groups">
              <OffsetList
                ref={groupsListRef}
                sticky
                fetchEndpoint={
                  IS_TENANT
                    ? 'api/v3/multi-tenant/lists/group'
                    : 'api/v2/suggestions/group'
                }
                endpointData={IS_TENANT ? 'data' : 'suggestions'}
                header={header}
                offsetPagination
                renderItem={({ item }) => (
                  <GroupsListItem
                    group={GroupModel.checkOrCreate(item.entity)}
                  />
                )}
                ListEmptyComponent={emptyMessageComponent()}
              />
            </DiscoveryTabContent>
          );
        default:
          return <View key="none" />;
      }
    };

    return (
      <Screen safe onlyTopEdge={IS_IOS}>
        <View style={sp.styles.style.flexContainer}>
          <Topbar
            title="Discovery"
            navigation={navigation}
            noInsets
            shadowLess
          />
          <AnimatePresence>{screen()}</AnimatePresence>
        </View>
        {!IS_IPAD && <CaptureFab navigation={navigation} />}
      </Screen>
    );
  }),
  'DiscoveryV2Screen',
);

const styles = sp.styles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
  header: ['bgPrimaryBackground', 'paddingTop', 'fullWidth', 'marginTopXXXL2'],
  bottomBorder: ['bcolorPrimaryBorder', 'borderBottom4x'],
  row: ['flexContainer', 'rowJustifySpaceBetween', 'marginVerticalXXL'],
  icon: ['marginHorizontalXXL', 'marginTop1x'],
  text: ['flexContainer', 'marginRightXL'],
});

const emptyMessage = (tab: TDiscoveryV2Tabs) => (onPress?: () => void) => {
  const emptyMessages: { [k in TDiscoveryV2Tabs]?: any } = {
    top: {
      title: 'Ignite the conversation',
      subtitle: 'The top posts from across the network will appear here. ',
      buttonText: sp.i18n.t('createAPost'),
    },
    'trending-tags': {
      title: 'Explore topics that are heating up',
      subtitle:
        'The most frequently-used tags on the network will appear here.',
    },
    channels: {
      icon: 'profile',
      title: 'Get ready for exploration',
      subtitle:
        'There are no channels to recommend for you yet. Check back later for personalized recommendations.',
      buttonText: 'Copy invite link',
    },
    groups: {
      icon: 'group',
      title: 'Be a pioneer in group exploration',
      subtitle:
        'There are no groups to recommend for you yet. Check back later for personalized recommendations.',
    },
  };

  const config = { ...emptyMessages[tab] };
  if (tab === 'top' && sp.permissions.shouldHideCreatePost()) {
    delete config.buttonText;
  }
  return <EmptyMessage {...config} onPress={onPress} />;
};
