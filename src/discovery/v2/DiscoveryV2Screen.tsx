import React, { Component, Fragment, useEffect, useState } from 'react';

import { View } from 'react-native';
import { observer } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';

import i18n from '../../common/services/i18n.service';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import Topbar from '../../topbar/Topbar';
//import { TopbarTabbar } from './topbar/TopbarTabbar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import { TabParamList } from '../../tabs/TabsScreenNew';

import ThemedStyles from '../../styles/ThemedStyles';
import { useDiscoveryV2Store } from './DiscoveryV2Context';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import TopBarButtonTabBar from '../../common/components/topbar-tabbar/TopBarButtonTabBar';
import NewsfeedList from '../../newsfeed/NewsfeedList';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';

interface Props {}

/**
 * Discovery Feed Screen
 */

export const DiscoveryV2Screen = observer((props: Props) => {
  const [shouldRefreshOnTabPress, setShouldRefreshOnTabPress] = useState(false);
  const store = useDiscoveryV2Store();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      if (shouldRefreshOnTabPress) {
        onRefresh();
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

  const onRefresh = () => {
    store.refreshTrends();
  };

  const screen = () => {
    switch (store.activeTabId) {
      case 'foryou':
        return <DiscoveryTrendsList style={{}} />;
      case 'your-tags':
        return <DiscoveryTagsList style={{}} type="your" />;
      case 'trending-tags':
        return <DiscoveryTagsList style={{}} type="trending" />;
      case 'boosts':
        useLegacyStores().newsfeed.refresh();
        return (
          <NewsfeedList
            newsfeed={useLegacyStores().newsfeed}
            navigation={useNavigation()}
          />
        );
      default:
        return <View></View>;
    }
  };

  return (
    <View style={ThemedStyles.style.flexContainer}>
      <Topbar
        title={i18n.t('tabTitleDiscovery')}
        navigation={navigation}
        style={[CS.shadow]}
      />

      <View style={ThemedStyles.style.backgroundSecondary}>
        <TopbarTabbar
          current={store.activeTabId}
          onChange={(tabId) => {
            store.setTabId(tabId as TDiscoveryV2Tabs);
          }}
          tabs={[
            { id: 'foryou', title: 'Just for you' },
            { id: 'your-tags', title: 'Your tags' },
            { id: 'trending-tags', title: 'Trending' },
            { id: 'boosts', title: 'Boosted' },
          ]}></TopbarTabbar>
      </View>

      <View style={ThemedStyles.style.flexContainer}>{screen()}</View>
    </View>
  );
});
