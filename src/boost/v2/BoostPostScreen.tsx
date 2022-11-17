import { RouteProp } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import useWalletConnect from '../../blockchain/v2/walletconnect/useWalletConnect';
import ModalScreen from '../../common/components/ModalScreen';
import TopbarTabbar, {
  TabType,
} from '../../common/components/topbar-tabbar/TopbarTabbar';
import { useStores } from '../../common/hooks/use-stores';
import i18n from '../../common/services/i18n.service';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostTab from './BoostTab';
import createBoostStore from './createBoostStore';

type BoostTabType = 'cash' | 'tokens';

type BoostPostScreenRouteProp = RouteProp<
  RootStackParamList,
  'BoostPostScreen'
>;

type PropsType = {
  route: BoostPostScreenRouteProp;
};

const BoostPostScreen = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;
  const wallet = useStores().wallet;
  const wc = useWalletConnect();
  const localStore = useLocalStore(createBoostStore, {
    wc,
    wallet: wallet.wallet,
    entity: route.params?.entity,
    boostType: 'post',
  });

  const tabs: Array<TabType<BoostTabType>> = [
    { id: 'cash', title: i18n.t('wallet.cash') },
    { id: 'tokens', title: i18n.t('tokens') },
  ];

  useEffect(() => {
    wallet.loadOffchainAndReceiver();
  }, [wallet]);

  return (
    <ModalScreen
      title={i18n.t('boosts.boostPost')}
      source={require('../../assets/boostBG.png')}>
      <DismissKeyboard>
        <View style={theme.marginTop2x}>
          <TopbarTabbar
            tabs={tabs}
            onChange={localStore.setPayment}
            current={localStore.payment}
          />
        </View>
        <BoostTab localStore={localStore} />
      </DismissKeyboard>
    </ModalScreen>
  );
});

export default BoostPostScreen;
