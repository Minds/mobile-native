import React, { useEffect, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '../common/services/i18n.service';
import StripeCardSelector from '../wire/methods/v2/StripeCardSelector';
import CenteredLoading from '../common/components/CenteredLoading';

import { UserError } from '../common/UserError';
import Button from '../common/components/Button';
import { useStores } from '../common/hooks/use-stores';
import Header from './Header';
import createUpgradeStore from './createUpgradeStore';
import PaymentMethod from './PaymentMethod';
import {
  payMethod,
  UpgradeScreenNavigationProp,
  UpgradeScreenRouteProp,
} from './types';
import PlanOptions from './PlanOptions';

const isIos = Platform.OS === 'ios';

type PropsType = {
  route: UpgradeScreenRouteProp;
  navigation: UpgradeScreenNavigationProp;
};

const PlusScreen = observer(({ navigation, route }: PropsType) => {
  const localStore = useLocalStore(createUpgradeStore);
  const wallet = useStores().wallet;
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const { onComplete, pro } = route.params;

  const complete = useCallback(
    (done: any) => {
      localStore.setLoading(false);
      onComplete(done);
      navigation.goBack();
    },
    [navigation, onComplete, localStore],
  );

  const payWith = useCallback(
    async (currency: payMethod) => {
      try {
        localStore.wire.setAmount(localStore.selectedOption.cost);
        localStore.wire.setCurrency(currency);
        localStore.wire.setOwner(localStore.owner);
        localStore.wire.setRecurring(
          localStore.selectedOption.id === 'monthly',
        );
        if (currency === 'usd') {
          localStore.wire.setPaymentMethodId(localStore.card.id);
        }
        const done = await localStore.wire.send();
        if (!done) {
          throw new UserError(i18n.t('boosts.errorPayment'));
        }

        complete(done);
      } catch (err) {
        throw new UserError(err.message);
      } finally {
        localStore.setLoading(false);
      }
    },
    [complete, localStore],
  );

  const confirmSend = useCallback(async () => {
    localStore.setLoading(true);
    payWith(localStore.method);
  }, [localStore, payWith]);

  useEffect(() => {
    const init = async () => {
      await wallet.loadPrices();
      if (!localStore.loaded) {
        localStore.init(pro, wallet.prices.minds);
      }
    };
    init();
  }, [localStore, pro, wallet]);

  if (localStore.settings === false) {
    return <CenteredLoading />;
  }

  const cleanTop = { marginTop: insets.top + (isIos ? 60 : 50) };

  return (
    <View style={[cleanTop, styles.container, theme.backgroundSecondary]}>
      <Header pro={pro} />
      {!isIos && <PaymentMethod store={localStore} />}
      <PlanOptions store={localStore} pro={pro} />
      {localStore.method === 'usd' && (
        <View style={theme.marginTop6x}>
          <StripeCardSelector onCardSelected={localStore.setCard} />
        </View>
      )}
      <View style={[theme.padding2x, theme.borderTop, theme.borderPrimary]}>
        <Button
          onPress={confirmSend}
          text={i18n.t(`monetize.${pro ? 'pro' : 'plus'}Join`)}
          containerStyle={styles.buttonRight}
          loading={localStore.loading}
          action
        />
      </View>
    </View>
  );
});

export default PlusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
  },
  buttonRight: {
    alignSelf: 'flex-end',
  },
});
