import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import { Spacer } from '~/common/ui';
import useWalletConnect from '../../blockchain/v2/walletconnect/useWalletConnect';
import ModalScreen from '../../common/components/ModalScreen';
import { useStores } from '../../common/hooks/use-stores';
import i18n from '../../common/services/i18n.service';
import sessionService from '../../common/services/session.service';
import BoostButton from './BoostButton';
import BoostInput from './BoostInput';
import BoostPayment from './TokenSelector';
import createBoostStore from './createBoostStore';

const BoostChannelScreen = observer(() => {
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
      <DismissKeyboard>
        <Spacer bottom="XL">
          <BoostInput localStore={localStore} />
          <BoostPayment localStore={localStore} />
        </Spacer>
        <BoostButton localStore={localStore} />
      </DismissKeyboard>
    </ModalScreen>
  );
});

export default BoostChannelScreen;
