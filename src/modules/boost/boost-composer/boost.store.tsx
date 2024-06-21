import { useLocalStore } from 'mobx-react';
import React, { useContext } from 'react';
import UserModel from '~/channel/UserModel';
import apiService from '~/common/services/api.service';
import mindsConfigService from '~/common/services/minds-config.service';
import ActivityModel from '~/newsfeed/ActivityModel';
import type { WalletStoreType } from '~/wallet/v2/createWalletStore';
import { showNotification } from '../../../../AppMessages';
import { InsightEstimateResponse } from '../hooks/useBoostInsights';
import {
  DEFAULT_DAILY_CASH_BUDGET,
  DEFAULT_DAILY_TOKEN_BUDGET,
  DEFAULT_DURATION,
} from './boost.constants';

export type BoostType = 'post' | 'channel' | 'group';

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
  goalsEnabled: boostType === 'post' && entity?.isOwner(),
  config: mindsConfigService.getSettings().boost as IBoostConfig,
  entity,
  insights: null as null | InsightEstimateResponse,
  wallet,
  boostType,
  audience: 'safe' as IBoostAudience,
  target_platform_web: true as boolean,
  target_platform_ios: true as boolean,
  target_platform_android: true as boolean,
  goal: BoostGoal.VIEWS as BoostGoal,
  button: BoostButtonText.SUBSCRIBE_TO_MY_CHANNEL as BoostButtonText,
  link: BoostButtonText.LEARN_MORE as BoostButtonText,
  linkUrl: '',
  iapTransaction: undefined as undefined | string,
  get platformsText() {
    const enabled: string[] = [];
    this.target_platform_ios && enabled.push('iOS');
    this.target_platform_android && enabled.push('Android');
    this.target_platform_web && enabled.push('Web');

    return enabled.join(', ');
  },
  togglePlatformWeb() {
    this.target_platform_web = !this.target_platform_web;
  },
  togglePlatformIos() {
    this.target_platform_ios = !this.target_platform_ios;
  },
  togglePlatformAndroid() {
    this.target_platform_android = !this.target_platform_android;
  },
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
  paymentType: 'cash' as IPaymentType,
  setPaymentType(paymentType: IPaymentType) {
    this.paymentType = paymentType;
  },
  setSelectedCardId(cardId: string) {
    this.selectedCardId = cardId;
  },
  selectedCardId: '',
  setIapTransaction(transaction: string) {
    this.iapTransaction = transaction;
  },
  createBoost(creditPaymentMethod?: string) {
    if (!this.validate()) {
      return null;
    }

    const payload: CreateBoostParams = {
      entity_guid: this.entity.guid,
      target_suitability: this.audience === 'safe' ? 1 : 2,
      target_location: ['channel', 'group'].includes(boostType) ? 2 : 1,
      payment_method: this.paymentType === 'cash' ? 1 : 2,
      payment_method_id:
        this.paymentType === 'cash'
          ? creditPaymentMethod ?? this.selectedCardId // ios_iap, android_iap
          : undefined,
      daily_bid: this.amount,
      duration_days: this.duration,
    };

    if (this.goalsEnabled) {
      payload.goal = this.goal;
      if (this.goal === BoostGoal.SUBSCRIBERS) {
        payload.goal_button_text = this.button;
      } else if (this.goal === BoostGoal.CLICKS) {
        payload.goal_button_url = this.linkUrl;
        payload.goal_button_text = this.link;
      }
    }

    return apiService.post('api/v3/boosts', payload).catch(e => {
      console.error('boost error', JSON.stringify(payload), JSON.stringify(e));
      showNotification(e.message || 'Something went wrong', 'danger');
      throw e;
    });
  },
  validate() {
    return true;
  },
  isAmountValid() {
    return true;
  },
  get amountRangeValues() {
    return {
      stepSize: 1,
      defaultValue: 1,
      maximumRangeValue: this.config.max[this.paymentType],
      minimumRangeValue: this.config.min[this.paymentType],
      steps: this.config.bid_increments[this.paymentType],
    };
  },
  get durationRangeValues() {
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
  payment_method_id?: string;
  daily_bid: number;
  duration_days: number;

  goal?: BoostGoal;
  goal_button_text?: BoostButtonText;
  goal_button_url?: string;
  target_platform_web?: boolean;
  target_platform_android?: boolean;
  target_platform_ios?: boolean;
  iap_transaction?: string;
}

export type IBoostAudience = 'safe' | 'mature';
export enum BoostGoal {
  VIEWS = 1, // "expand reach" - require nothing
  ENGAGEMENT = 2, // "increase engagement" - require nothing
  SUBSCRIBERS = 3, // "grow your following" - require button
  CLICKS = 4, // "get more clicks" - require button and url
}
export enum BoostButtonText {
  SUBSCRIBE_TO_MY_CHANNEL = 1,
  GET_CONNECTED = 2,
  STAY_IN_THE_LOOP = 3,
  LEARN_MORE = 4,
  GET_STARTED = 5,
  SIGN_UP = 6,
  TRY_FOR_FREE = 7,
  SHOP_NOW = 8,
  BUY_NOW = 9,
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
