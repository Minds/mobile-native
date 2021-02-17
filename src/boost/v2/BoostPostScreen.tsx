import { RouteProp } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import TopbarTabbar, {
  TabType,
} from '../../common/components/topbar-tabbar/TopbarTabbar';
import { useStores } from '../../common/hooks/use-stores';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import createBoostStore from './createBoostStore';
import NewsfeedBoostTab from './NewsfeedBoostTab';
import OfferBoostTab from './OfferBoostTab';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import useWalletConnect from '../../blockchain/v2/walletconnect/useWalletConnect';
import ModalScreen from '../../common/components/ModalScreen';

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
    <ModalScreen
      title={i18n.t('boosts.boostPost')}
      source={require('../../assets/boostBG.png')}>
      <View style={theme.marginTop4x}>
        <TopbarTabbar tabs={tabs} onChange={setTab} current={tab} />
      </View>
      {renderTab()}
    </ModalScreen>
  );
});

export default BoostPostScreen;
