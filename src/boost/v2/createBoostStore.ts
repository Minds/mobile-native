import UserModel from '../../channel/UserModel';
import ActivityModel from '../../newsfeed/ActivityModel';
import { Wallet, WalletCurrency } from '../../wallet/v2/WalletTypes';

/**
 *
 * example post
 * https://www.minds.com/api/v2/boost/prepare/1183558312603938816?
 * response: {"status":"success","guid":"1183558605666807808","checksum":"77be3b34b4314092808b8e704f2f7861"}
 *
 * https://www.minds.com/api/v2/boost/activity/1183558312603938816/968187695744425997
 * params: {"guid":"1183558605666807808","bidType":"tokens","impressions":5000,"categories":[],"priority":null,"paymentMethod":{"method":"offchain","address":"offchain"},"checksum":"77be3b34b4314092808b8e704f2f7861"}
 *
 * example channel
 * https://www.minds.com/api/v2/boost/prepare/968187695744425997?
 * response {"status":"success","guid":"1183559893827186688","checksum":"d3430d3c251b9596fb27ae4d645e3c09"}
 *
 * https://www.minds.com/api/v2/boost/user/968187695744425997/0
 * params: {"guid":"1183559893827186688","bidType":"tokens","impressions":1000,"categories":[],"priority":null,"paymentMethod":{"method":"offchain","address":"offchain"},"checksum":"d3430d3c251b9596fb27ae4d645e3c09"}
 */

const createBoostStore = ({
  wallet,
  guid,
  boostType,
}: {
  wallet: Wallet;
  guid: string;
  boostType: string;
}) => {
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
