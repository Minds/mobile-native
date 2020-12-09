import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Button from '../../common/components/Button';
import { useStores } from '../../common/hooks/__mocks__/use-stores';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostButton from './BoostButton';
import BoostHeader from './BoostHeader';
import BoostInput from './BoostInput';
import BoostPayment from './BoostPayment';
import createBoostStore from './createBoostStore';

const BoostChannelScreen = observer(() => {
  const theme = ThemedStyles.style;
  const wallet = useStores().wallet;
  const localStore = useLocalStore(createBoostStore, {
    wallet: wallet.wallet,
  });
  useEffect(() => {
    wallet.loadOffchainAndReceiver();
  }, [wallet]);
  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <BoostHeader title={i18n.t('boosts.boostChannel')} />
      <View style={[theme.flexContainer, theme.marginTop7x]}>
        <BoostInput localStore={localStore} />
        <BoostPayment localStore={localStore} />
      </View>
      <BoostButton localStore={localStore} boostType={'channel'} />
    </View>
  );
});

export default BoostChannelScreen;
