import { CurrencyType } from "../../types/Payment";

export type TokensOptions = 'overview' | 'transactions' | 'settings';
export type UsdOptions = 'earnings' | 'transactions' | 'settings';

export interface StripeDetails {
  bankAccount?: any;
  totalBalance?: any;
  pendingBalance?: { amount: number };
  pendingBalanceSplit: number;
  totalPaidOutSplit: number;
  hasAccount: boolean;
  hasBank: boolean;
  verified: boolean;
  city: string;
  country: string;
  firstName: string;
  lastName: string;
  postCode: string;
  routingNumber: any;
  accountNumber: string;
  ssn?: any;
  state: string;
  street: string;
  dob: string;
  phoneNumber: string;
  personalIdNumber?: string;
}

export interface WalletCurrency {
  label: string;
  unit: string;
  balance: number;
  address: string | null;
  stripeDetails?: StripeDetails;
}

export interface WalletLimits {
  wire: number;
}

export interface Wallet {
  loaded: boolean;
  tokens: WalletCurrency;
  offchain: WalletCurrency;
  onchain: WalletCurrency;
  receiver: WalletCurrency;
  cash: WalletCurrency;
  eth: WalletCurrency;
  btc: WalletCurrency;
  limits: WalletLimits;
}

export interface BaseEarning {
  amount_cents: number;
  amount_usd: number;
  currency: CurrencyType;
  id: string;
}

export interface Earnings extends BaseEarning {
  items: BaseEarning[];
}
