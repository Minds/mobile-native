export type TokensOptions = 'overview' | 'transactions' | 'settings';

export interface StripeDetails {
  bankAccount?: any;
  totalBalance?: any;
  pendingBalance?: { amount: number };
  pendingBalanceSplit: number;
  totalPaidOutSplit: number;
  hasAccount: boolean;
  hasBank: boolean;
  verified: boolean;
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
