import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import useWalletConnect from '../../blockchain/v2/walletconnect/useWalletConnect';
import ModalScreen from '../../common/components/ModalScreen';
import { useStores } from '../../common/hooks/use-stores';
import i18n from '../../common/services/i18n.service';
import sessionService from '../../common/services/session.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostButton from './BoostButton';
import BoostInput from './BoostInput';
import BoostPayment from './BoostPayment';
import createBoostStore from './createBoostStore';

const BoostChannelScreen = observer(() => {
  const theme = ThemedStyles.style;
  const wallet = useStores().wallet;
  const wc = useWalletConnect();
  const localStore = useLocalStore(createBoostStore, {
    wc,
    wallet: wallet.wallet,
    entity: sessionService.getUser(),
  });
  useEffect(() => {
    wallet.loadOffchainAndReceiver();
  }, [wallet]);
  return (
    <ModalScreen
      title={i18n.t('boosts.boostChannel')}
      source={require('../../assets/boostBG.png')}>
      <View style={[theme.flexContainer, theme.marginTop7x]}>
        <BoostInput localStore={localStore} />
        <BoostPayment localStore={localStore} />
      </View>
      <BoostButton localStore={localStore} />
    </ModalScreen>
  );
});

export default BoostChannelScreen;
