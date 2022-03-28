import React, { useEffect, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { StyleSheet, View, Platform } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '../common/services/i18n.service';
import StripeCardSelector from '../wire/methods/v2/StripeCardSelector';

import { UserError } from '../common/UserError';
import FitScrollView from '../common/components/FitScrollView';
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
import { useDimensions } from '@react-native-community/hooks';
import UpgradeScreenPlaceHolder from './UpgradeScreenPlaceHolder';
import { Button, Column, H3 } from '~ui';
import { PRO_PLUS_SUBSCRIPTION_ENABLED } from '~/config/Config';

const isIos = Platform.OS === 'ios';

type PropsType = {
  route: UpgradeScreenRouteProp;
  navigation: UpgradeScreenNavigationProp;
};

const UpgradeScreen = observer(({ navigation, route }: PropsType) => {
  const localStore = useLocalStore(createUpgradeStore);
  const wallet = useStores().wallet;
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const { height } = useDimensions().window;
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
      if (!localStore.loaded) {
        localStore.init(pro);
      }
    };
    init();
  }, [localStore, pro, wallet]);

  const topMargin = height / 18;
  const cleanTop = {
    marginTop: insets.top + (isIos ? topMargin : topMargin + 10),
  };

  return (
    <View style={[cleanTop, styles.container, theme.bgSecondaryBackground]}>
      <Header pro={pro} />
      {!PRO_PLUS_SUBSCRIPTION_ENABLED ? (
        <Column top="XL" align="centerBoth" horizontal="L">
          <H3>Sorry, this is not available on iOS</H3>
          <Button
            top="XL2"
            mode="outline"
            type="action"
            onPress={navigation.goBack}>
            {i18n.t('close')}
          </Button>
        </Column>
      ) : (
        <>
          {localStore.settings === false && <UpgradeScreenPlaceHolder />}
          {localStore.settings !== false && (
            <FitScrollView>
              {!isIos && <PaymentMethod store={localStore} />}
              <PlanOptions store={localStore} pro={pro} />
              {localStore.method === 'usd' && (
                <View style={theme.marginTop6x}>
                  <StripeCardSelector onCardSelected={localStore.setCard} />
                </View>
              )}
              <Button
                mode="outline"
                type="action"
                top="L2"
                horizontal="L"
                loading={localStore.loading}
                onPress={confirmSend}
                spinner>
                {i18n.t(`monetize.${pro ? 'pro' : 'plus'}Join`)}
              </Button>
            </FitScrollView>
          )}
        </>
      )}
    </View>
  );
});

export default UpgradeScreen;

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
