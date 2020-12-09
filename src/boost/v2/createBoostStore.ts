import { Wallet, WalletCurrency } from '../../wallet/v2/WalletTypes';

const createBoostStore = ({ wallet }: { wallet: Wallet }) => {
  const store = {
    payment: 'tokens' as 'tokens' | 'onchain',
    selectedPaymentMethod: wallet.offchain as WalletCurrency,
    amountViews: '1000',
    amountTokens: '1',
    target: null,
    scheduleTs: null,
    postToFacebook: false,
    inProgress: false,
    error: '',
    rates: {
      balance: null,
      rate: 1,
      min: 250,
      cap: 5000,
      onchain: 1000,
      tokens: 1000,
      minUsd: 1,
      priority: 1,
    },
    isSearchingTarget: false,
    allowedTypes: {},
    setAmountViews(value: string) {
      this.amountViews = value;
      const aV = parseFloat(this.amountViews);
      if (!isNaN(aV)) {
        if (this.payment === 'tokens') {
          this.amountTokens = (aV / this.rates.tokens).toString();
        } else {
          this.amountTokens = (aV / this.rates.onchain).toString();
        }
      }
    },
    setAmountTokens(value: string) {
      this.amountTokens = value;
      const aT = parseFloat(this.amountTokens);
      if (!isNaN(aT)) {
        if (this.payment === 'tokens') {
          this.amountViews = (aT * this.rates.tokens).toString();
        } else {
          this.amountViews = (aT * this.rates.onchain).toString();
        }
      }
    },
    get paymentMethods() {
      return [wallet.onchain, wallet.offchain];
    },
    setPaymentMethod(walletCurrency: WalletCurrency) {
      this.payment =
        walletCurrency.label === 'Off-chain' ? 'tokens' : 'onchain';
      this.selectedPaymentMethod = walletCurrency;
    },
    getMethodKey(walletCurrency: WalletCurrency) {
      return walletCurrency.label;
    },
  };
  return store;
};

export type BoostStoreType = ReturnType<typeof createBoostStore>;
export default createBoostStore;
