import React, { useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';

import { Button } from '~ui';
import StripeCardSelector from '~/common/components/stripe-card-selector/StripeCardSelector';
import { IS_IOS } from '~/config/Config';
import { UpgradeStoreType } from './createUpgradeStore';
import PaymentMethod from './PaymentMethod';
import PlanOptions from './PlanOptions';
import { confirm } from '~/common/components/Confirm';
import WireStore from '~/wire/WireStore';
import { PayMethodType, SubscriptionType } from './types';
import { UserError } from '~/common/UserError';
import type UserModel from '~/channel/UserModel';
import { StripeCard } from '~/wire/WireTypes';
import UpgradeScreenPlaceHolder from './UpgradeScreenPlaceHolder';
import sp from '~/services/serviceProvider';

type UpgradeStripeProps = {
  store: UpgradeStoreType;
  pro: boolean;
  onComplete: (any) => void;
};

/**
 * Upgrade stripe or tokens
 */
const UpgradeStripeTokens = ({
  store,
  pro,
  onComplete,
}: UpgradeStripeProps) => {
  const navigation = useNavigation();

  const wireStore = useUpgradeWireStore();
  const i18n = sp.i18n;

  const confirmSend = useCallback(async () => {
    if (
      !(await confirm({
        title: i18n.t('supermind.confirmNoRefund.title'),
        description: i18n.t('supermind.confirmNoRefund.description'),
      }))
    ) {
      return;
    }
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
  }, [store, navigation, wireStore, onComplete, i18n]);

  return !store.settings ? (
    <UpgradeScreenPlaceHolder />
  ) : (
    <>
      {!IS_IOS && <PaymentMethod store={store} />}
      <PlanOptions store={store} />
      {store.method === 'usd' && (
        <StripeCardSelector onCardSelected={wireStore.setCard} />
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

type PayParamsType = {
  amount: number;
  type: SubscriptionType;
  method: PayMethodType;
  cardId?: string;
  owner: UserModel;
};

export const useUpgradeWireStore = () => {
  return useLocalStore(() => ({
    wire: new WireStore(),
    card: undefined as StripeCard | undefined,
    loading: false,
    setLoading(loading) {
      this.loading = loading;
    },
    setCard(card: StripeCard) {
      this.card = card;
    },
    async pay({ amount, type, method, cardId, owner }: PayParamsType) {
      if (this.loading) {
        throw new UserError('Already in progress');
      }
      try {
        this.setLoading(true);
        this.wire.setAmount(amount);
        this.wire.setCurrency(method);
        this.wire.setOwner(owner);
        this.wire.setRecurring(type === 'monthly');
        if (method === 'usd') {
          if (cardId) {
            this.wire.setPaymentMethodId(cardId);
          } else {
            throw new UserError('Please choose a payment method');
          }
        }
        const done = await this.wire.send();
        if (!done) {
          throw new UserError(sp.i18n.t('boosts.errorPayment'));
        }
        return done;
      } catch (err) {
        if (err instanceof Error) {
          throw new UserError(err.message);
        } else {
          throw new UserError(sp.i18n.t('boosts.errorPayment'));
        }
      } finally {
        this.setLoading(false);
      }
    },
  }));
};

export default observer(UpgradeStripeTokens);
