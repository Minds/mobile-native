import { useNavigation, useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { IS_IOS, IS_IPAD } from '~/config/Config';
import Banner from '~/common/components/Banner';
import TopbarTabbar from '~/common/components/topbar-tabbar/TopbarTabbar';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import i18n from '~/common/services/i18n.service';
import ThemedStyles from '~/styles/ThemedStyles';
import { Screen, ScreenHeader } from '~ui/screen';
import { TDiscoveryV2Tabs } from './DiscoveryV2Store';
import { DiscoveryTagsList } from './tags/DiscoveryTagsList';
import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import { useMindsPlusV2Store } from './useDiscoveryV2Store';
import OnboardingOverlay from '~/components/OnboardingOverlay';

/**
 * Discovery Feed Screen
 */
const PlusDiscoveryScreen = observer(() => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const route = useRoute<any>();
  const store = useMindsPlusV2Store();
  const user = useCurrentUser();
  const { backEnable = !IS_IPAD } = route.params ?? {};

  const onUpgrade = useCallback(() => {
    navigation.navigate('UpgradeScreen', {
      onComplete: (success: any) => {
        if (success) {
          user?.togglePlus();
        }
      },
      pro: false,
    });
  }, [navigation, user]);

  return (
    <Screen safe onlyTopEdge={IS_IOS}>
      <ScreenHeader back={backEnable} title={i18n.t('plusTabTitleDiscovery')} />
      {!user?.plus && (
        <Banner
          actionText="Upgrade"
          actionIdentifier="discovery:plus:upgrade"
          text="Access exclusive Minds+ content"
          typography="B2"
          onAction={onUpgrade}
        />
      )}
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
      <View style={theme.flexContainer}>
        {store.activeTabId === 'foryou' ? (
          <DiscoveryTrendsList plus={true} store={store} />
        ) : store.activeTabId === 'your-tags' ? (
          <DiscoveryTagsList type="your" plus={true} store={store} />
        ) : store.activeTabId === 'trending-tags' ? (
          <DiscoveryTagsList type="trending" plus={true} store={store} />
        ) : (
          <View />
        )}
      </View>
      <OnboardingOverlay type="minds_plus" />
    </Screen>
  );
});

export default PlusDiscoveryScreen;
