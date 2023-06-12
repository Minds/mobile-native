import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';

import ModalScreen from '~/common/components/ModalScreen';
import { useStores } from '~/common/hooks/use-stores';
import i18n from '~/common/services/i18n.service';
import sessionService from '~/common/services/session.service';
import { WalletStoreType } from '~/wallet/v2/createWalletStore';
import Setup from './Setup';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

const Withdrawal = observer(() => {
  const walletStore: WalletStoreType = useStores().wallet;
  const navigation = useNavigation<any>();
  const user = sessionService.getUser();
  const showSetup = !user.rewards || !user.plus;
  return (
    <ModalScreen
      source={require('~/assets/withdrawalbg.jpg')}
      title={i18n.t('wallet.transferToOnchain')}>
      {showSetup && (
        <Setup navigation={navigation} user={user} walletStore={walletStore} />
      )}
    </ModalScreen>
  );
});

export default withErrorBoundaryScreen(Withdrawal, 'Withdrawal');
