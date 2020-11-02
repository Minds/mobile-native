import React from 'react';

import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import ThemedStyles from '../../styles/ThemedStyles';
import { useDiscoveryV2Store } from './DiscoveryV2Context';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import { InternalStackParamList } from '../../navigation/NavigationTypes';
import i18n from '../../common/services/i18n.service';

type PlusDiscoveryScreenRouteProp = RouteProp<
  InternalStackParamList,
  'PlusDiscoveryScreen'
>;
type PlusDiscoveryScreenNavigationProp = StackNavigationProp<
  InternalStackParamList,
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
        return <DiscoveryTrendsList plus={true} />;
      case 'your-tags':
        return <DiscoveryTagsList type="your" plus={true} />;
      case 'trending-tags':
        return <DiscoveryTagsList type="trending" plus={true} />;
      default:
        return <View />;
    }
  };

  const theme = ThemedStyles.style;

  return (
    <View style={ThemedStyles.style.flexContainer}>
      <View style={ThemedStyles.style.backgroundPrimary}>
        <Text
          style={[
            theme.titleText,
            theme.paddingLeft4x,
            theme.paddingVertical2x,
          ]}>
          {i18n.t('plusTabTitleDiscovery')}
        </Text>
        <TopbarTabbar
          current={store.activeTabId}
          onChange={(tabId) => {
            store.setTabId(tabId as TDiscoveryV2Tabs);
          }}
          tabs={[
            { id: 'foryou', title: i18n.t('discovery.justForYou') },
            { id: 'your-tags', title: i18n.t('discovery.yourTags') },
            { id: 'trending-tags', title: i18n.t('discovery.trending') },
          ]}
        />
      </View>
      <View style={ThemedStyles.style.flexContainer}>{screen()}</View>
    </View>
  );
});

export default PlusDiscoveryScreen;
