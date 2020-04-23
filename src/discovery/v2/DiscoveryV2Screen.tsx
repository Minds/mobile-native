import React, { useEffect } from 'react';

import { View } from 'react-native';
import { observer } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';

import i18n from '../../common/services/i18n.service';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import Topbar from '../../topbar/Topbar';
import { TopbarTabbar } from './topbar/TopbarTabbar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import { TabParamList } from '../../tabs/TabsScreenNew';
import { useStores } from '../../common/hooks/use-stores';
import ThemedStyles from '../../styles/ThemedStyles';

interface Props {}

/**
 * Discovery Feed Screen
 */

export const DiscoveryV2Screen = observer((props: Props) => {
  const { discoveryV2 } = useStores();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      discoveryV2.refreshTrends();
    });

    return unsubscribe;
  }, [discoveryV2, navigation]);

  return (
    <View style={ThemedStyles.style.flexContainer}>
      <Topbar
        title={i18n.t('tabTitleDiscovery')}
        navigation={navigation}
        style={[CS.shadow]}
      />
      <TopbarTabbar />
      {discoveryV2.activeTabId === 'foryou' ? (
        <DiscoveryTrendsList style={ThemedStyles.style.flexContainer} />
      ) : (
        <View />
      )}
    </View>
  );
});
