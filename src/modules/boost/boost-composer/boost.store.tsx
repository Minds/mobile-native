import { useLocalStore } from 'mobx-react';
import React, { useContext } from 'react';
import type { BoostType } from '~/boost/legacy/createBoostStore';
import UserModel from '~/channel/UserModel';
import apiService from '~/common/services/api.service';
import mindsConfigService from '~/common/services/minds-config.service';
import { IS_IOS } from '~/config/Config';
import ActivityModel from '~/newsfeed/ActivityModel';
import type { WalletStoreType } from '~/wallet/v2/createWalletStore';
import { showNotification } from '../../../../AppMessages';
import { hasVariation } from '../../../../ExperimentsProvider';
import { InsightEstimateResponse } from '../hooks/useBoostInsights';
import {
  DEFAULT_DAILY_CASH_BUDGET,
  DEFAULT_DAILY_TOKEN_BUDGET,
  DEFAULT_DURATION,
} from './boost.constants';

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
  goalsEnabled:
    boostType === 'post' &&
    entity?.isOwner() &&
    hasVariation('minds-3952-boost-goals'),
  config: mindsConfigService.getSettings().boost as IBoostConfig,
  entity,
  insights: null as null | InsightEstimateResponse,
  wallet,
  boostType,
  audience: 'safe' as IBoostAudience,
  goal: BoostGoal.VIEWS as BoostGoal,
  button: BoostButtonText.SUBSCRIBE_TO_MY_CHANNEL as BoostButtonText,
  link: BoostButtonText.LEARN_MORE as BoostButtonText,
  linkUrl: '',
  setInsights(insights) {
    this.insights = insights;
  },
  setAudience(audience: IBoostAudience) {
    this.audience = audience;
  },
  setGoal(goal: BoostGoal) {
    this.goal = goal;
  },
  setButton(button: BoostButtonText) {
    this.button = button;
  },
  setLink(link: BoostButtonText) {
    this.link = link;
  },
  setLinkUrl(url: string) {
    this.linkUrl = url;
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
        goal: this.goal,
        goal_button_text:
          this.goal === BoostGoal.CLICKS ? this.link : this.button,
        goal_button_url: this.linkUrl,
      } as CreateBoostParams)
      .catch(e => {
        showNotification(e.message || 'Something went wrong', 'danger');
        throw e;
      });
  },
  validate() {
    return true;
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
export enum BoostGoal {
  VIEWS = 1, // "expand reach"
  ENGAGEMENT = 2, // "increase engagement"
  SUBSCRIBERS = 3, // "grow your following"
  CLICKS = 4, // "get more clicks"
}
export enum BoostButtonText {
  SUBSCRIBE_TO_MY_CHANNEL = 1,
  GET_CONNECTED = 2,
  STAY_IN_THE_LOOP = 3,
  LEARN_MORE = 4,
  GET_STARTED = 5,
  SIGN_UP = 6,
  TRY_FOR_FREE = 7,
}
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
