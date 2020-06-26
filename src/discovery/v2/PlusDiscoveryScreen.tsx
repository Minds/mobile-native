import React from 'react';

import { View } from 'react-native';
import { observer } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';

import i18n from '../../common/services/i18n.service';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import Topbar from '../../topbar/Topbar';

import ThemedStyles from '../../styles/ThemedStyles';
import { useDiscoveryV2Store } from './DiscoveryV2Context';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type PlusDiscoveryScreenRouteProp = RouteProp<
  AppStackParamList,
  'PlusDiscoveryScreen'
>;
type PlusDiscoveryScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'PlusDiscoveryScreen'
>;

type PropsType = {
  navigation: PlusDiscoveryScreenNavigationProp;
};

/**
 * Discovery Feed Screen
 */
const PlusDiscoveryScreen = observer(({ navigation }: PropsType) => {
  const store = useDiscoveryV2Store();

  const screen = () => {
    switch (store.activeTabId) {
      case 'foryou':
        return <DiscoveryTrendsList />;
      case 'trending-tags':
        return <DiscoveryTagsList type="trending" />;
      default:
        return <View />;
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
            { id: 'trending-tags', title: 'Discovery by Tags' },
          ]}
        />
      </View>
      <View style={ThemedStyles.style.flexContainer}>{screen()}</View>
    </View>
  );
});

export default PlusDiscoveryScreen;
