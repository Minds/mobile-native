import React from 'react';

import { View, Text } from 'react-native';
import { observer } from 'mobx-react';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import ThemedStyles from '../../styles/ThemedStyles';
import { useMindsPlusV2Store } from './useDiscoveryV2Store';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import i18n from '../../common/services/i18n.service';

/**
 * Discovery Feed Screen
 */
const PlusDiscoveryScreen = observer(() => {
  const store = useMindsPlusV2Store();

  const screen = () => {
    switch (store.activeTabId) {
      case 'foryou':
        return <DiscoveryTrendsList plus={true} store={store} />;
      case 'your-tags':
        return <DiscoveryTagsList type="your" plus={true} store={store} />;
      case 'trending-tags':
        return <DiscoveryTagsList type="trending" plus={true} store={store} />;
      default:
        return <View />;
    }
  };

  const theme = ThemedStyles.style;

  return (
    <View style={ThemedStyles.style.flexContainer}>
      <View style={ThemedStyles.style.backgroundSecondary}>
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
