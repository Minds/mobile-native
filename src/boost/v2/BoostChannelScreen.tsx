import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useWalletConnect from '../../blockchain/v2/walletconnect/useWalletConnect';
import { useStores } from '../../common/hooks/__mocks__/use-stores';
import i18n from '../../common/services/i18n.service';
import sessionService from '../../common/services/session.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostButton from './BoostButton';
import BoostHeader from './BoostHeader';
import BoostInput from './BoostInput';
import BoostPayment from './BoostPayment';
import createBoostStore from './createBoostStore';

const BoostChannelScreen = observer(() => {
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const cleanTop = insets.top
    ? { marginTop: insets.top + 50 }
    : { marginTop: 50 };
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
    <View style={[styles.container, theme.backgroundPrimary, cleanTop]}>
      <BoostHeader title={i18n.t('boosts.boostChannel')} />
      <View style={[theme.flexContainer, theme.marginTop7x]}>
        <BoostInput localStore={localStore} />
        <BoostPayment localStore={localStore} />
      </View>
      <BoostButton localStore={localStore} />
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

export default BoostChannelScreen;
