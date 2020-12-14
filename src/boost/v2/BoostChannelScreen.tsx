import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const localStore = useLocalStore(createBoostStore, {
    wallet: wallet.wallet,
    entity: sessionService.getUser(),
  });
  useEffect(() => {
    wallet.loadOffchainAndReceiver();
  }, [wallet]);
  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary, cleanTop]}>
      <BoostHeader title={i18n.t('boosts.boostChannel')} />
      <View style={[theme.flexContainer, theme.marginTop7x]}>
        <BoostInput localStore={localStore} />
        <BoostPayment localStore={localStore} />
      </View>
      <BoostButton localStore={localStore} />
    </View>
  );
});

export default BoostChannelScreen;
