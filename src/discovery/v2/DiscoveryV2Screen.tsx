import React, { useEffect, useState } from 'react';

import { View } from 'react-native';
import { observer } from 'mobx-react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import i18n from '../../common/services/i18n.service';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import { TabParamList } from '../../tabs/TabsScreen';
import ThemedStyles from '../../styles/ThemedStyles';
import { useDiscoveryV2Store } from './DiscoveryV2Context';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import FeedList from '../../common/components/FeedList';

interface Props {
  navigation: BottomTabNavigationProp<TabParamList>;
}

/**
 * Discovery Feed Screen
 */
export const DiscoveryV2Screen = observer((props: Props) => {
  const [shouldRefreshOnTabPress, setShouldRefreshOnTabPress] = useState(false);
  const store = useDiscoveryV2Store();
  const navigation = props.navigation;

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
        return <DiscoveryTrendsList />;
      case 'your-tags':
        return <DiscoveryTagsList type="your" />;
      case 'trending-tags':
        return <DiscoveryTagsList type="trending" />;
      case 'boosts':
        store.boostFeed.fetchRemoteOrLocal();
        return <FeedList feedStore={store.boostFeed} navigation={navigation} />;
      default:
        return <View />;
    }
  };

  return (
    <View style={ThemedStyles.style.flexContainer}>
      <View style={ThemedStyles.style.backgroundSecondary}>
        <TopbarTabbar
          current={store.activeTabId}
          onChange={(tabId) => {
            store.setTabId(tabId as TDiscoveryV2Tabs);
          }}
          tabs={[
            { id: 'foryou', title: i18n.t('discovery.justForYou') },
            { id: 'your-tags', title: i18n.t('discovery.yourTags') },
            { id: 'trending-tags', title: i18n.t('discovery.trending') },
            { id: 'boosts', title: i18n.t('boosted') },
          ]}
        />
      </View>
      <View style={ThemedStyles.style.flexContainer}>{screen()}</View>
    </View>
  );
});
