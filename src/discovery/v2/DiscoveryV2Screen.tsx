import React, { useEffect, useState } from 'react';

import { View } from 'react-native';
import { observer } from 'mobx-react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import i18n from '../../common/services/i18n.service';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import { TabParamList } from '../../tabs/TabsScreen';
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

interface Props {
  navigation: BottomTabNavigationProp<TabParamList>;
}

/**
 * Discovery Feed Screen
 */
export const DiscoveryV2Screen = withErrorBoundary(
  observer((props: Props) => {
    const theme = ThemedStyles.style;
    const [shouldRefreshOnTabPress, setShouldRefreshOnTabPress] = useState(
      false,
    );
    const store = useDiscoveryV2Store();
    const navigation = props.navigation;

    const tabs = React.useMemo(
      () => [
        { id: 'foryou', title: i18n.t('discovery.justForYou') },
        { id: 'your-tags', title: i18n.t('discovery.yourTags') },
        { id: 'trending-tags', title: i18n.t('discovery.trending') },
        { id: 'boosts', title: i18n.t('boosted') },
      ],
      [i18n.locale],
    );

    useEffect(() => {
      const unsubscribe = navigation.addListener('tabPress', () => {
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

    const screen = () => {
      switch (store.activeTabId) {
        case 'foryou':
          return (
            <DiscoveryTabContent key="foryou">
              <DiscoveryTrendsList store={store} />
            </DiscoveryTabContent>
          );
        case 'your-tags':
          return (
            <DiscoveryTabContent key="your-tags">
              <DiscoveryTagsList type="your" store={store} />
            </DiscoveryTabContent>
          );
        case 'trending-tags':
          store.trendingFeed.fetchRemoteOrLocal();
          return (
            <DiscoveryTabContent key="trending-tags">
              <FeedList
                header={
                  <DiscoveryTagsList
                    type="trending"
                    store={store}
                    style={styles.bottomBorder}
                    showManageTags={false}
                  />
                }
                feedStore={store.trendingFeed}
                navigation={navigation}
              />
            </DiscoveryTabContent>
          );
        case 'boosts':
          store.boostFeed.fetchRemoteOrLocal();
          return (
            <DiscoveryTabContent key="boosts">
              <FeedList feedStore={store.boostFeed} navigation={navigation} />
            </DiscoveryTabContent>
          );
        default:
          return <View key="none" />;
      }
    };

    return (
      <View style={styles.container}>
        <View style={theme.paddingTop}>
          <InitialOnboardingButton />
          <TopbarTabbar
            current={store.activeTabId}
            onChange={tabId => {
              store.setTabId(tabId as TDiscoveryV2Tabs);
            }}
            tabs={tabs}
          />
        </View>
        <View style={theme.flexContainer}>
          <AnimatePresence>{screen()}</AnimatePresence>
        </View>
      </View>
    );
  }),
);

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
  bottomBorder: {
    borderBottomColor: '#eee',
    borderBottomWidth: 10,
  },
});
