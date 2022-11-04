import React, { useEffect, useState } from 'react';

import { View } from 'react-native';
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
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import DiscoveryTabContent from './DiscoveryTabContent';
import Empty from '~/common/components/Empty';
import Button from '~/common/components/Button';
import Topbar from '~/topbar/Topbar';
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import FeedListSticky from '~/common/components/FeedListSticky';
import { Screen } from '~/common/ui';
import { useFeature } from '@growthbook/growthbook-react';

interface Props {
  navigation: any;
}

/**
 * Discovery Feed Screen
 */
export const DiscoveryV2Screen = withErrorBoundary(
  observer((props: Props) => {
    const [shouldRefreshOnTabPress, setShouldRefreshOnTabPress] = useState(
      false,
    );
    const store = useDiscoveryV2Store();
    const isSupermindsGlobalFeedOn = useFeature(
      'mob-4482-global-supermind-feed',
    ).on;
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
          isSupermindsGlobalFeedOn
            ? { id: 'superminds', title: i18n.t('supermind.supermind') }
            : null,
        ].filter(Boolean) as { id: string; title: string }[],
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
      <>
        <Topbar title="Discovery" navigation={navigation} noInsets shadowLess />
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
      </>
    );

    useEffect(() => {
      const unsubscribe = navigation.getParent().addListener('tabPress', () => {
        if (shouldRefreshOnTabPress) {
          listRef.current?.scrollToTop();
          store.refreshActiveTab();
        }
      });
      return unsubscribe;
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

    useEffect(() => {
      store.topFeed.fetchLocalOrRemote();
    }, [store]);

    const screen = () => {
      switch (store.activeTabId) {
        case 'top':
          return (
            <DiscoveryTabContent key="top">
              <FeedListSticky
                ref={listRef}
                header={header}
                feedStore={store.topFeed}
                navigation={navigation}
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
                navigation={navigation}
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
                navigation={navigation}
                emptyMessage={emptyBoosts}
              />
            </DiscoveryTabContent>
          );
        case 'superminds':
          return (
            <DiscoveryTabContent key="superminds">
              <FeedListSticky
                ref={listRef}
                header={header}
                feedStore={store.supermindsFeed}
                navigation={navigation}
                emptyMessage={emptyBoosts}
              />
            </DiscoveryTabContent>
          );
        default:
          return <View key="none" />;
      }
    };

    return (
      <Screen safe>
        <View style={ThemedStyles.style.flexContainer}>
          <AnimatePresence>{screen()}</AnimatePresence>
        </View>
      </Screen>
    );
  }),
);

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
  header: ['bgPrimaryBackground', 'paddingTop', 'fullWidth'],
  bottomBorder: ['bcolorPrimaryBorder', 'borderBottom4x'],
});
