import { useLocalStore } from 'mobx-react';
import React, { useContext } from 'react';
import type { BoostType } from '~/boost/legacy/createBoostStore';
import UserModel from '~/channel/UserModel';
import apiService from '~/common/services/api.service';
import mindsConfigService from '~/common/services/minds-config.service';
import ActivityModel from '~/newsfeed/ActivityModel';
import type { WalletStoreType } from '~/wallet/v2/createWalletStore';
import { showNotification } from '../../../../AppMessages';
import { IS_FROM_STORE, IS_IOS } from '~/config/Config';
import {
  DEFAULT_DAILY_CASH_BUDGET,
  DEFAULT_DAILY_TOKEN_BUDGET,
  DEFAULT_DURATION,
} from './boost.constants';
import { InsightEstimateResponse } from '../hooks/useBoostInsights';
import { hasVariation } from 'ExperimentsProvider';

export const IS_IAP_ON = IS_FROM_STORE && hasVariation('mob-4851-iap-boosts');

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
  insights: null as null | InsightEstimateResponse,
  wallet,
  boostType,
  audience: 'safe' as IBoostAudience,
  setInsights(insights) {
    this.insights = insights;
  },
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
  cashAmount: DEFAULT_DAILY_CASH_BUDGET,
  tokenAmount: DEFAULT_DAILY_TOKEN_BUDGET,
  duration: DEFAULT_DURATION,
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
  /**
   * IAP
   */
  get skus() {
    // return [`boost.a${this.amount}.d${this.duration}.001`];
    return ['boost.consumable.001'];
  },
  isAmountValid() {
    return IS_IAP_ON ? this.total < 450 : true;
  },
  get amountRangeValues() {
    if (IS_IAP_ON && this.paymentType === 'cash') {
      return {
        stepSize: 5,
        defaultValue: 10,
        minimumRangeValue: 5,
        maximumRangeValue: 15,
      };
    }
    return {
      stepSize: 1,
      defaultValue: 1,
      maximumRangeValue: this.config.max[this.paymentType],
      minimumRangeValue: this.config.min[this.paymentType],
      steps: this.config.bid_increments[this.paymentType],
    };
  },
  get durationRangeValues() {
    if (IS_IAP_ON && this.paymentType === 'cash') {
      return {
        stepSize: 1,
        defaultValue: 1,
        minimumRangeValue: 1,
        maximumRangeValue: 30,
        steps: [1, 3, 10, 30],
      };
    }
    return {
      stepSize: 1,
      defaultValue: 1,
      maximumRangeValue: this.config.duration.max,
      minimumRangeValue: this.config.duration.min,
    };
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

export type BoostStoreType = ReturnType<typeof createBoostStore>;

export const BoostStoreContext = React.createContext<BoostStoreType | null>(
  null,
);

export function useBoostStore() {
  return useContext(BoostStoreContext)!;
}

export function BoostStoreProvider(
  props: React.PropsWithChildren<BoostStoreParams>,
) {
  const boostStore = useLocalStore(createBoostStore, props);
  return <BoostStoreContext.Provider {...props} value={boostStore} />;
}
