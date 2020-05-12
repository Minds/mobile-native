import type UserModel from '../channel/UserModel';
export type Currency = 'tokens' | 'usd' | 'eth' | 'btc';

export type Reward = {
  amount: number;
  description: 'string';
  currency: Currency;
};

export type WireRequest = {
  guid: string;
  owner: UserModel;
  currency: Currency;
  amount: number;
  recurring: boolean;
  paymentMethodId?: string;
};

type PaymentMethod =
  | 'usd'
  | 'eth'
  | 'usd'
  | 'onchain'
  | 'offchain'
  | 'creditcard';

export type Wallet = {
  address: string;
};

export type PayloadOnchain = {
  type: 'onchain' | 'eth';
  wallet: Wallet;
  cancelled?: boolean;
};

export type Payload = {
  type: PaymentMethod;
  cancelled?: boolean;
  address?: string;
  token?: string;
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
