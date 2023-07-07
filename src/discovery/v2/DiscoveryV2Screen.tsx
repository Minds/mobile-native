import React, { useCallback, useEffect, useState } from 'react';

import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { AnimatePresence } from 'moti';

import i18n from '../../common/services/i18n.service';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import ThemedStyles from '../../styles/ThemedStyles';
import { useDiscoveryV2Store } from './useDiscoveryV2Store';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import { InjectItem } from '../../common/components/FeedList';
import type FeedList from '../../common/components/FeedList';
import InitialOnboardingButton from '../../onboarding/v2/InitialOnboardingButton';
import DiscoveryTabContent from './DiscoveryTabContent';
import Empty from '~/common/components/Empty';
import Button from '~/common/components/Button';
import Topbar from '~/topbar/Topbar';
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import FeedListSticky from '~/common/components/FeedListSticky';
import { Screen } from '~/common/ui';
import { IS_IOS } from '~/config/Config';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { DiscoveryStackScreenProps } from '~/navigation/DiscoveryStack';

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
          { id: 'foryou', title: i18n.t('discovery.justForYou') },
          { id: 'your-tags', title: i18n.t('discovery.yourTags') },
          { id: 'trending-tags', title: i18n.t('discovery.trending') },
          { id: 'boosts', title: i18n.t('boosted') },
          { id: 'supermind', title: i18n.t('supermind.supermind') },
        ].filter(Boolean) as { id: string; title: string }[],
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
      [navigation],
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
      const onPress = () => {
        if (shouldRefreshOnTabPress) {
          listRef.current?.scrollToOffset({ offset: 0 });
          store.refreshActiveTab();
        }
      };
      const parent = navigation.getParent();
      //@ts-ignore
      const unsubscribeTab = parent?.addListener('tabPress', onPress);
      //@ts-ignore
      const unsubscribeDrawer = parent?.addListener('drawerItemPress', onPress);
      return () => {
        unsubscribeTab?.();
        unsubscribeDrawer?.();
      };
    }, [store, navigation, shouldRefreshOnTabPress]);

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

    const tab = props.route.params?.tab;

    useEffect(() => {
      store.topFeed.fetchLocalOrRemote();
      if (tab) {
        store.setTabId(tab);
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
              />
            </DiscoveryTabContent>
          );
        case 'boosts':
          return (
            <DiscoveryTabContent key="boosts">
              <FeedListSticky
                ref={listRef}
                header={header}
                feedStore={store.boostFeed}
                emptyMessage={emptyBoosts}
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
