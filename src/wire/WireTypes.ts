import type UserModel from '../channel/UserModel';
import { ApiResponse } from '~/common/services/ApiResponse';
export type Currency = 'tokens' | 'usd' | 'eth' | 'btc';

export type Reward = {
  amount: number;
  description: string;
  currency: Currency;
};

export type WireRequest = {
  guid: string;
  owner: UserModel;
  currency: Currency;
  amount: number;
  recurring: boolean;
  offchain: boolean;
  paymentMethodId?: string;
};

export type SupportTiersType = {
  amount: string;
  description: string;
  urn: string;
  expires: number;
  entity_guid: string;
  guid: string;
  public: boolean;
  name: string;
  usd: string;
  has_usd: boolean;
  has_tokens: boolean;
  tokens: string;
  subscription_urn?: string;
};

export interface SupportTiersResponse extends ApiResponse {
  support_tiers: SupportTiersType[];
}

export type PaymentMethod =
  | 'usd'
  | 'eth'
  | 'usd'
  | 'onchain'
  | 'offchain'
  | 'creditcard';

export type Wallet = {
  address: string;
};

export type TransactionPayload = {
  method: PaymentMethod;
  cancelled?: boolean;
  receiver?: string;
  address?: string;
  token?: string;
  txHash?: string;
  paymentMethodId?: string;
} | null;

export type StripeCard = {
  card_brand: string;
  id: string;
  card_country: string;
  card_last4: string;
  card_expires: string;
};
