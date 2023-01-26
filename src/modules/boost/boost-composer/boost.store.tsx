import { useLocalStore } from 'mobx-react';
import React, { useContext } from 'react';
import type { BoostType } from '~/boost/legacy/createBoostStore';
import UserModel from '~/channel/UserModel';
import apiService from '~/common/services/api.service';
import mindsConfigService from '~/common/services/minds-config.service';
import ActivityModel from '~/newsfeed/ActivityModel';
import type { WalletStoreType } from '~/wallet/v2/createWalletStore';
import { showNotification } from '../../../../AppMessages';
import { IS_IOS } from '~/config/Config';

type BoostStoreParams = {
  boostType: BoostType;
  entity: UserModel | ActivityModel;
  wallet: WalletStoreType;
};

export const createBoostStore = ({
  boostType,
  entity,
  wallet,
}: BoostStoreParams) => ({
  config: mindsConfigService.getSettings().boost as IBoostConfig,
  entity,
  wallet,
  boostType,
  audience: 'safe' as IBoostAudience,
  setAudience(audience: IBoostAudience) {
    this.audience = audience;
  },
  get amount() {
    return this.paymentType === 'cash' ? this.cashAmount : this.tokenAmount;
  },
  setAmount(amount: number) {
    if (this.paymentType === 'cash') {
      this.cashAmount = amount;
    } else {
      this.tokenAmount = amount;
    }
  },
  cashAmount: 5,
  tokenAmount: 5,
  duration: 1,
  setDuration(duration: number) {
    this.duration = duration;
  },
  get total() {
    return this.amount * this.duration;
  },
  paymentType: (IS_IOS ? 'offchain_tokens' : 'cash') as IPaymentType,
  setPaymentType(paymentType: IPaymentType) {
    this.paymentType = paymentType;
  },
  setSelectedCardId(cardId: string) {
    this.selectedCardId = cardId;
  },
  selectedCardId: '',
  createBoost() {
    if (!this.validate()) {
      return null;
    }

    return apiService
      .post('api/v3/boosts', {
        entity_guid: this.entity.guid,
        target_suitability: this.audience === 'safe' ? 1 : 2,
        target_location: boostType === 'post' ? 1 : 2,
        payment_method: this.paymentType === 'cash' ? 1 : 2,
        payment_method_id:
          this.paymentType === 'cash' ? this.selectedCardId : undefined,
        daily_bid: this.amount,
        duration_days: this.duration,
      } as CreateBoostParams)
      .catch(e => {
        showNotification(e.message || 'Something went wrong', 'danger');
        throw e;
      });
  },
  validate() {
    return true;
  },
  confirmedToUseToken: false,
  setConfirmedToUseToken(value: boolean) {
    this.confirmedToUseToken = value;
  },
});

export interface CreateBoostParams {
  entity_guid: string;
  target_suitability: number;
  target_location: number;
  payment_method: number;
  payment_method_id: string;
  daily_bid: number;
  duration_days: number;
}

export type IBoostAudience = 'safe' | 'mature';
export type IPaymentType = 'cash' | 'offchain_tokens' | 'onchain_tokens';
type IBoostConfig = {
  bid_increments: {
    cash: number[];
    offchain_tokens: number[];
    onchain_tokens: number[];
  };
  duration: { increments: number[]; max: number; min: number };
  max: { cash: number; offchain_tokens: number; onchain_tokens: number };
  min: { cash: number; offchain_tokens: number; onchain_tokens: number };
  network: { max: number; min: number };
  peer: { max: number; min: number };
};

export const BoostStoreContext = React.createContext<ReturnType<
  typeof createBoostStore
> | null>(null);

export function useBoostStore() {
  return useContext(BoostStoreContext)!;
}

export function BoostStoreProvider(
  props: React.PropsWithChildren<BoostStoreParams>,
) {
  const boostStore = useLocalStore(createBoostStore, props);
  return <BoostStoreContext.Provider {...props} value={boostStore} />;
}
