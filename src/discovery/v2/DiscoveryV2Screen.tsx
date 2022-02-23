import React, { useEffect, useState } from 'react';

import { View } from 'react-native';
import { observer } from 'mobx-react';

import i18n from '../../common/services/i18n.service';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import ThemedStyles from '../../styles/ThemedStyles';
import { useDiscoveryV2Store } from './useDiscoveryV2Store';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import FeedList from '../../common/components/FeedList';
import InitialOnboardingButton from '../../onboarding/v2/InitialOnboardingButton';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import { AnimatePresence } from 'moti';
import DiscoveryTabContent from './DiscoveryTabContent';
import Empty from '~/common/components/Empty';
import Button from '~/common/components/Button';
import Topbar from '~/topbar/Topbar';

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
    const navigation = props.navigation;

    const tabs = React.useMemo(
      () => [
        { id: 'top', title: i18n.t('discovery.top') },
        { id: 'foryou', title: i18n.t('discovery.justForYou') },
        { id: 'your-tags', title: i18n.t('discovery.yourTags') },
        { id: 'trending-tags', title: i18n.t('discovery.trending') },
        { id: 'boosts', title: i18n.t('boosted') },
      ],
      [i18n.locale],
    );

    const emptyBoosts = React.useMemo(
      () => (
        <Empty
          title={i18n.t('boosts.emptyList')}
          subtitle={i18n.t('boosts.emptyListSubtitle')}>
          <Button
            onPress={() => navigation.navigate('BoostSettingsScreen')}
            text={i18n.t('moreScreen.settings')}
            large
            action
          />
        </Empty>
      ),
      [navigation],
    );

    useEffect(() => {
      const unsubscribe = navigation.getParent().addListener('tabPress', () => {
        if (shouldRefreshOnTabPress) {
          store.refreshTrends();
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

    const header = (
      <>
        <Topbar title="Discovery" navigation={navigation} />
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

    const screen = () => {
      switch (store.activeTabId) {
        case 'top':
          return (
            <DiscoveryTabContent key="top">
              <FeedList
                stickyHeaderIndices={sticky}
                stickyHeaderHiddenOnScroll
                feedStore={store.topFeed}
                navigation={navigation}
                header={header}
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
              <FeedList
                stickyHeaderIndices={sticky}
                stickyHeaderHiddenOnScroll
                header={header}
                feedStore={store.trendingFeed}
                navigation={navigation}
                prepend={
                  <DiscoveryTagsList
                    type="trending"
                    store={store}
                    style={styles.bottomBorder}
                    showManageTags={false}
                  />
                }
              />
            </DiscoveryTabContent>
          );
        case 'boosts':
          return (
            <DiscoveryTabContent key="boosts">
              <FeedList
                stickyHeaderIndices={sticky}
                stickyHeaderHiddenOnScroll
                header={header}
                feedStore={store.boostFeed}
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
      <View style={styles.container}>
        <AnimatePresence>{screen()}</AnimatePresence>
      </View>
    );
  }),
);

const sticky = [0];

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
  header: ['flexContainer', 'bgPrimaryBackground', 'paddingTop'],
  bottomBorder: {
    borderBottomColor: '#eee',
    borderBottomWidth: 10,
  },
});
