import React from 'react';

import { View } from 'react-native';
import { observer } from 'mobx-react';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import ThemedStyles from '../../styles/ThemedStyles';
import { useMindsPlusV2Store } from './useDiscoveryV2Store';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import i18n from '../../common/services/i18n.service';
import { ScreenHeader, Screen } from '~ui/screen';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

const SAFE_AREA_EDGES: Edge[] = ['top'];
/**
 * Discovery Feed Screen
 */
const PlusDiscoveryScreen = observer(() => {
  const theme = ThemedStyles.style;
  const store = useMindsPlusV2Store();

  const header = (
    <SafeAreaView edges={SAFE_AREA_EDGES} style={theme.bgPrimaryBackground}>
      <ScreenHeader title={i18n.t('plusTabTitleDiscovery')} />

      <TopbarTabbar
        current={store.activeTabId}
        onChange={tabId => {
          store.setTabId(tabId as TDiscoveryV2Tabs);
        }}
        tabs={[
          { id: 'foryou', title: i18n.t('discovery.justForYou') },
          { id: 'your-tags', title: i18n.t('discovery.yourTags') },
          { id: 'trending-tags', title: i18n.t('discovery.trending') },
        ]}
      />
    </SafeAreaView>
  );

  const screen = () => {
    switch (store.activeTabId) {
      case 'foryou':
        return (
          <DiscoveryTrendsList header={header} plus={true} store={store} />
        );
      case 'your-tags':
        return (
          <DiscoveryTagsList
            header={header}
            type="your"
            plus={true}
            store={store}
          />
        );
      case 'trending-tags':
        return (
          <DiscoveryTagsList
            header={header}
            type="trending"
            plus={true}
            store={store}
          />
        );
      default:
        return <View />;
    }
  };

  return screen();
});

export default PlusDiscoveryScreen;
