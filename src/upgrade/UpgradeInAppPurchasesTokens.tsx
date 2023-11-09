import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';

import { B3, Button } from '~ui';
import i18n from '~/common/services/i18n.service';
import {
  IAP_SKUS_PLUS,
  IAP_SKUS_PRO,
  UpgradeStoreType,
} from './createUpgradeStore';
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
import sessionService from '~/common/services/session.service';
import apiService from '~/common/services/api.service';
import { useStores } from '~/common/hooks/use-stores';
import { WalletStoreType } from '~/wallet/v2/createWalletStore';
import { IS_IOS } from '~/config/Config';

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

  const walletStore: WalletStoreType = useStores().wallet;
  const [disabledButton, setDisabledButton] = useState(true);

  const iapPlans = pro ? IAP_SKUS_PRO : IAP_SKUS_PLUS;

  const {
    currentPurchase,
    subscriptions,
    getSubscriptions,
    finishTransaction,
  } = useIAP();

  const cheapestTokenPrice = store.plansTokens.reduce(
    (min, b) => Math.min(min, b?.cost ?? 1000),
    store.plansTokens.length > 0 ? store.plansTokens[0]?.cost ?? 1000 : 1000,
  );

  const insufficientFunds = walletStore.balance < cheapestTokenPrice;

  /**
   * Get IAP subscriptions
   */
  useEffect(() => {
    if (store.method === 'usd') {
      const skus = Object.values(iapPlans);
      if (skus) {
        getSubscriptions({ skus }).catch(err => console.warn('err', err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.method, store, iapPlans]);

  useEffect(() => {
    store.plansUSD.forEach(plan => {
      const sub = subscriptions.find(
        subscription => subscription.productId === plan.iapSku,
      );
      if ((sub as SubscriptionAndroid)?.subscriptionOfferDetails) {
        plan.offerToken = (
          sub as SubscriptionAndroid
        )?.subscriptionOfferDetails?.[0].offerToken;
      }
    });
    setDisabledButton(
      store.method === 'tokens'
        ? insufficientFunds
        : (subscriptions?.length ?? 0) === 0,
    );
  }, [store.plansUSD, insufficientFunds, store.method, subscriptions]);

  /**
   * Handle purchase
   */
  useEffect(() => {
    const checkCurrentPurchase = async () => {
      let payload = {};
      try {
        if (currentPurchase?.productId) {
          const {
            productId: subscriptionId,
            purchaseToken,
            autoRenewingAndroid,
            originalTransactionDateIOS,
            originalTransactionIdentifierIOS,
            verificationResultIOS,
          } = currentPurchase;
          payload = {
            service: IS_IOS ? 'apple' : 'google',
            subscriptionId,
            purchaseToken,
            ...(IS_IOS
              ? {
                  originalTransactionDateIOS,
                  originalTransactionIdentifierIOS,
                  verificationResultIOS,
                }
              : { autoRenewingAndroid }),
          };

          await apiService.post(
            '/api/v3/payments/iap/subscription/acknowledge',
            payload,
          );

          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: false,
          });

          onComplete(currentPurchase);
          navigation.goBack();
        }
      } catch (error) {
        console.error(
          'UpgradeIAP',
          JSON.stringify(payload),
          JSON.stringify(error),
        );
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
      const offerToken = store.selectedOption.offerToken;

      // Android Subscriptions needs a offerToken
      if (sku === undefined || (!IS_IOS && !offerToken)) {
        showNotification('No SKU or offerToken', 'warning');
        console.warn('sku', sku, offerToken);
        return;
      }
      const payload = {
        sku,
        ...(IS_IOS
          ? {
              appAccountToken: sessionService.getUser().guid,
              quantity: 1,
            }
          : {
              obfuscatedAccountIdAndroid: sessionService.getUser().guid,
              subscriptionOffers: [{ sku, offerToken }],
            }),
      };
      requestSubscription(payload).catch(error => {
        console.warn('IAP Error', error, payload);
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
        <>
          <PlanOptions store={store} />
          {insufficientFunds && (
            <B3 top="XL" align="center">
              {i18n.t('monetize.insufficientTokens')}!
            </B3>
          )}
        </>
      ) : (
        (subscriptions?.length ?? 0) !== 0 && (
          <PlanOptionsIAP store={store} subscriptions={subscriptions} />
        )
      )}
      <Button
        mode="outline"
        type="action"
        top="L2"
        horizontal="L"
        loading={wireStore.loading}
        onPress={confirmSend}
        disabled={disabledButton}
        spinner>
        {i18n.t(`monetize.${pro ? 'pro' : 'plus'}Join`)}
      </Button>
    </>
  );
};

export default observer(UpgradeInAppPurchasesTokens);
