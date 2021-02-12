import { RouteProp } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import TopbarTabbar, {
  TabType,
} from '../../common/components/topbar-tabbar/TopbarTabbar';
import { useStores } from '../../common/hooks/use-stores';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostHeader from './BoostHeader';
import createBoostStore from './createBoostStore';
import NewsfeedBoostTab from './NewsfeedBoostTab';
import OfferBoostTab from './OfferBoostTab';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useWalletConnect from '../../blockchain/v2/walletconnect/useWalletConnect';

type BoostTabType = 'newsfeed' | 'offer';

type BoostPostScreenRouteProp = RouteProp<
  RootStackParamList,
  'BoostPostScreen'
>;

type PropsType = {
  route: BoostPostScreenRouteProp;
};

const BoostPostScreen = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const cleanTop = insets.top
    ? { marginTop: insets.top + 50 }
    : { marginTop: 30 };
  const [tab, setTab] = useState<BoostTabType>('newsfeed');
  const wallet = useStores().wallet;
  const wc = useWalletConnect();
  const localStore = useLocalStore(createBoostStore, {
    wc,
    wallet: wallet.wallet,
    entity: route.params.entity,
  });
  useEffect(() => {
    wallet.loadOffchainAndReceiver();
  }, [wallet]);
  const tabs: Array<TabType<BoostTabType>> = [
    { id: 'newsfeed', title: i18n.t('boosts.tabNewsfeed') },
    { id: 'offer', title: i18n.t('boosts.tabOffers') },
  ];
  const renderTab = () => {
    switch (tab) {
      case 'newsfeed':
        return <NewsfeedBoostTab localStore={localStore} />;

      case 'offer':
        return <OfferBoostTab localStore={localStore} />;
    }
  };
  return (
    <View style={[styles.container, theme.backgroundPrimary, cleanTop]}>
      <BoostHeader title={i18n.t('boosts.boostPost')} />
      <View style={theme.marginTop4x}>
        <TopbarTabbar tabs={tabs} onChange={setTab} current={tab} />
      </View>
      {renderTab()}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
  },
});

export default BoostPostScreen;
