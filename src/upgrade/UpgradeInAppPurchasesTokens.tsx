import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';

import { Button } from '~ui';
import i18n from '~/common/services/i18n.service';
import { UpgradeStoreType } from './createUpgradeStore';
import PaymentMethod from './PaymentMethod';
import PlanOptions from './PlanOptions';
import { confirm } from '~/common/components/Confirm';
import { useUpgradeWireStore } from './UpgradeStripeTokens';
import {
  PurchaseError,
  requestSubscription,
  SubscriptionAndroid,
  useIAP,
} from 'react-native-iap';
import UpgradeScreenPlaceHolder from './UpgradeScreenPlaceHolder';
import PlanOptionsIAP from './PlanOptionsIAP';
import logService from '~/common/services/log.service';
import { showNotification } from 'AppMessages';
import apiService from '~/common/services/api.service';

type UpgradeInPurchasesProps = {
  store: UpgradeStoreType;
  pro: boolean;
  onComplete: (any) => void;
};

/**
 * Upgrade in-app purchases or tokens
 */
const UpgradeInAppPurchasesTokens = ({
  store,
  pro,
  onComplete,
}: UpgradeInPurchasesProps) => {
  const navigation = useNavigation();

  const wireStore = useUpgradeWireStore();

  const {
    currentPurchase,
    subscriptions,
    getSubscriptions,
    finishTransaction,
  } = useIAP();

  /**
   * Get IAP subscriptions
   */
  useEffect(() => {
    if (store.method === 'usd') {
      const skus = store.plansUSD.map(plan => plan.iapSku as 'string');

      if (skus) {
        getSubscriptions({ skus });
      }
    }
  }, [getSubscriptions, store.method, store]);

  /**
   * Set set offer tokens to the subscription layer
   */
  useEffect(() => {
    store.plansUSD.forEach(plan => {
      const sub = subscriptions.find(
        subscription => subscription.productId === plan.iapSku,
      );
      if ((sub as SubscriptionAndroid)?.subscriptionOfferDetails) {
        plan.offerToken = (sub as SubscriptionAndroid)?.subscriptionOfferDetails?.[0].offerToken;
      }
    });
  }, [store.plansUSD, subscriptions]);

  /**
   * Handle purchase
   */
  useEffect(() => {
    const checkCurrentPurchase = async () => {
      try {
        if (currentPurchase?.productId) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: false,
          });

          //TODO: Implement call to the backend
          console.log('TRANSACTION FINISHED', currentPurchase);
          // apiService.post('dummySubEndpoint', {
          //   productId: currentPurchase.productId,
          //   token: currentPurchase.purchaseToken,
          // });

          onComplete(currentPurchase);
          navigation.goBack();
        }
      } catch (error) {
        if (error instanceof PurchaseError) {
          showNotification(error.message, 'warning');
        } else {
          showNotification(
            'There was an error with the purchase process',
            'warning',
          );
        }
        logService.exception(error);
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase, finishTransaction, navigation, onComplete]);

  /**
   * Confirm and purchase
   */
  const confirmSend = useCallback(async () => {
    if (
      !(await confirm({
        title: i18n.t('supermind.confirmNoRefund.title'),
        description: i18n.t('supermind.confirmNoRefund.description'),
      }))
    ) {
      return;
    }

    if (store.method === 'tokens') {
      const pay = await wireStore.pay({
        amount: store.selectedOption.cost,
        method: store.method,
        owner: store.owner,
        type: store.selectedOption.id,
        cardId: wireStore.card?.id,
      });
      if (pay) {
        onComplete(pay);
        navigation.goBack();
      }
    } else {
      const sku = store.selectedOption.iapSku;
      // Android Subscriptions needs a offerToken
      const offerToken = store.selectedOption.offerToken;

      sku &&
        offerToken &&
        requestSubscription({
          sku: sku,
          ...(offerToken && {
            subscriptionOffers: [{ sku, offerToken }],
          }),
        }).catch(error => {
          showNotification(error.message, 'warning');
        });
    }
  }, [store, wireStore, onComplete, navigation]);

  return !store.settings ? (
    <UpgradeScreenPlaceHolder />
  ) : (
    <>
      <PaymentMethod store={store} cashName="Cash" />
      {store.method === 'tokens' ? (
        <PlanOptions store={store} />
      ) : (
        subscriptions.length !== 0 && (
          <PlanOptionsIAP
            store={store}
            subscriptions={subscriptions as SubscriptionAndroid[]}
          />
        )
      )}
      <Button
        mode="outline"
        type="action"
        top="L2"
        horizontal="L"
        loading={wireStore.loading}
        onPress={confirmSend}
        spinner>
        {i18n.t(`monetize.${pro ? 'pro' : 'plus'}Join`)}
      </Button>
    </>
  );
};

export default observer(UpgradeInAppPurchasesTokens);
