import type { CurrencyType } from '../../types/Payment';
import api from '../../common/services/api.service';
import toFriendlyCrypto from '../../common/helpers/toFriendlyCrypto';
import logService from '../../common/services/log.service';
import type {
  StripeDetails,
  Wallet,
  TokensOptions,
  Earnings,
} from './WalletTypes';
// import BlockchainWalletService from '../../blockchain/wallet/BlockchainWalletService';
import i18n from '../../common/services/i18n.service';
// import BlockchainApiService from '../../blockchain/BlockchainApiService';
import { ChartTimespanType } from './currency-tabs/TokensChart';
import sessionService from '../../common/services/session.service';
import walletService, { WalletJoinResponse } from '../WalletService';
import moment from 'moment';

const getStartOfDayUnixTs = (date: Date) =>
  Number(moment(date).utc().startOf('day').format('X'));

export type EarningsCurrencyType = 'tokens' | 'usd';

export type ContributionMetric = {
  id: string;
  label: string;
  amount: string;
  score: number;
};

export type PricesType = {
  eth: string;
  minds: string;
};

const defaultStripeDetails = <StripeDetails>{
  loaded: false,
  hasAccount: false,
  hasBank: false,
  pendingBalanceSplit: 0,
  totalPaidOutSplit: 0,
  verified: false,
  accountNumber: '',
  bankAccount: null,
  city: '',
  country: 'US',
  firstName: '',
  lastName: '',
  postCode: '',
  routingNumber: null,
  ssn: null,
  state: '',
  street: '',
  dob: '',
  phoneNumber: '',
  personalIdNumber: '',
};

const defaultWallet = <Wallet>{
  loaded: false,
  tokens: {
    label: i18n.t('tokens'),
    unit: 'tokens',
    balance: 0,
    address: null,
  },
  offchain: {
    label: i18n.t('blockchain.offchain'),
    unit: 'tokens',
    balance: 0,
    address: 'offchain',
  },
  onchain: {
    label: i18n.t('blockchain.onchain'),
    unit: 'tokens',
    balance: 0, //eth balance
    address: null,
  },
  receiver: {
    label: i18n.t('blockchain.receiver'),
    unit: 'tokens',
    balance: 0,
    address: null,
  },
  cash: {
    label: i18n.t('wallet.cash'),
    unit: 'cash',
    balance: 0,
    address: null,
  },
  eth: {
    label: i18n.t('ether'),
    unit: 'eth',
    balance: 0,
    address: null,
  },
  btc: {
    label: i18n.t('bitcoin'),
    unit: 'btc',
    balance: 0,
    address: null,
  },
  limits: {
    wire: 0,
  },
};

const createWalletStore = () => ({
  currency: 'tokens' as CurrencyType,
  initialTab: <TokensOptions | undefined>undefined,
  chart: <ChartTimespanType>'7d',
  stripeDetails: defaultStripeDetails,
  balance: 0,
  wallet: defaultWallet,
  usdEarnings: [] as Earnings[],
  usdPayouts: [],
  usdEarningsTotal: 0,
  usdPayoutsTotals: 0,
  prices: { minds: '0', eth: '0' } as PricesType,
  /**
   * Set currency tab
   * @param currency
   */
  setCurrent(currency: CurrencyType, initialTab?: TokensOptions) {
    this.currency = currency;
    this.initialTab = initialTab;
  },
  /**
   * Set initial tab for tokens
   * @param value
   */
  setInitialTab(value?: TokensOptions) {
    this.initialTab = value;
  },
  // /**
  //  * Create on-chain address
  //  * @param setAsReceiver if true sets the address as receiver into the server
  //  */
  // async createOnchain(setAsReceiver: boolean = false) {
  //   try {
  //     const address: string = await BlockchainWalletService.create();
  //     if (!address) {
  //       throw new Error('Empty Address');
  //     }

  //     if (setAsReceiver) {
  //       await BlockchainApiService.setWallet(address);
  //     }

  //     // update wallet observables as an atomic action
  //     runInAction(() => {
  //       if (setAsReceiver) {
  //         this.wallet.receiver.address = address;
  //       }
  //       if (!this.wallet.onchain.address) {
  //         this.wallet.onchain.address = address;
  //       }
  //       if (!this.wallet.eth.address) {
  //         this.wallet.eth.address = address;
  //       }
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     if (err.message) {
  //       if (err.message === 'E_INVALID_PASSWORD_CHALLENGE_OUTCOME') {
  //         return;
  //       }
  //     }
  //     // show a warning for the user
  //     throw new UserError(i18n.t('blockchain.errorCreatingWallet'));
  //   }
  // },
  /**
   * Load wallet data
   */
  async loadWallet(): Promise<void> {
    this.loadBtcAccount();
    this.getTokenAccounts();
    this.loadStripeAccount();
  },
  /**
   * Get token accounts
   */
  async getTokenAccounts(): Promise<any> {
    const tokenTypes = ['tokens', 'onchain', 'offchain', 'receiver'];

    try {
      await this.loadOffchainAndReceiver();
      // await this.loadOnchain();

      const tokenWallet = {};
      tokenTypes.forEach(type => {
        tokenWallet[type] = this.wallet[type];
      });
      return tokenWallet;
    } catch (e) {
      console.error(e);
      return e;
    }
  },
  /**
   * Load offchain and receiver from the server
   */
  async loadOffchainAndReceiver(): Promise<void> {
    try {
      const response: any = await api.get('api/v2/blockchain/wallet/balance');

      if (response && response.addresses) {
        this.balance = toFriendlyCrypto(response.balance);
        this.wallet.tokens.balance = toFriendlyCrypto(response.balance);
        this.wallet.limits.wire = toFriendlyCrypto(response.wireCap);
        response.addresses.forEach(async address => {
          if (address.address === 'offchain') {
            this.wallet.offchain.balance = toFriendlyCrypto(address.balance);
          } else if (address.label === 'Receiver' && address.address) {
            this.wallet.receiver.balance = toFriendlyCrypto(address.balance);
            this.wallet.receiver.address = address.address;
            this.wallet.eth.balance = toFriendlyCrypto(address.ether_balance);
            this.wallet.onchain.balance = this.wallet.receiver.balance;
          }
        });

        this.wallet.loaded = true;
      } else {
        console.log('getTokenAccounts');
        console.error('No data');
      }
    } catch (e) {
      logService.exception(e);
    }
  },
  /**
   * Load Stripe account info
   */
  async loadStripeAccount(): Promise<StripeDetails> {
    try {
      const { account } = await api.get<any>('api/v2/payments/stripe/connect');
      this.setStripeAccount(account);
      this.stripeDetails.loaded = true;
    } catch (e) {
      // mark as loaded if it doesn't have an account
      if (e instanceof Error && e.message === 'Account not found') {
        this.stripeDetails.loaded = true;
      }
      logService.exception(e);
    }
    return this.stripeDetails;
  },
  /**
   * Set stripe account
   * @param account
   */
  setStripeAccount(account: StripeDetails): void {
    this.stripeDetails.hasAccount = true;
    this.stripeDetails.verified = account.verified;

    this.wallet.cash.address = 'stripe';

    if (account.totalBalance && account.pendingBalance) {
      this.wallet.cash.balance =
        (account.totalBalance.amount + account.pendingBalance.amount) / 100;
      this.stripeDetails.pendingBalanceSplit =
        account.pendingBalance.amount / 100;

      this.stripeDetails.totalPaidOutSplit =
        (account.totalBalance.amount - account.pendingBalance.amount) / 100;
    } else {
      this.wallet.cash.balance = 0;
    }

    if (account.bankAccount) {
      const bankCurrency: string = account.bankAccount.currency;
      this.wallet.cash.label = bankCurrency.toUpperCase();
      this.wallet.cash.unit = bankCurrency;
      this.stripeDetails.hasBank = true;
    }

    this.stripeDetails = { ...this.stripeDetails, ...account };

    this.stripeDetails = this.stripeDetails;
  },
  async loadBtcAccount(): Promise<any> {
    try {
      const response: any = await api.get('api/v2/wallet/btc/address');
      if (response && response.address) {
        this.wallet.btc.address = response.address;
      }
    } catch (e) {
      console.log('loadBtcAccount');
      logService.exception(e);
    }
  },
  async setBtcAccount(address): Promise<boolean> {
    try {
      const response = await api.post('api/v2/wallet/btc/address', {
        address,
      });

      if (response && response.status === 'success') {
        this.wallet.btc.address = address;
      }

      return true;
    } catch (e) {
      logService.exception(e);
      return false;
    }
  },
  async createStripeAccount(form): Promise<void | boolean> {
    const response = await (<any>api.put('api/v2/wallet/usd/account', form));
    if (!sessionService.getUser().programs) {
      sessionService.getUser().programs = [];
    }
    sessionService.getUser().programs.push('affiliate');

    sessionService.getUser().merchant = {
      id: response.account.id,
      service: 'stripe',
    };

    this.setStripeAccount(response.account);
  },
  async addStripeBank(form) {
    const response = <any>(
      await api.post('api/v2/payments/stripe/connect/bank', form)
    );

    // Refresh the account
    await this.loadStripeAccount();

    return response;
  },
  async leaveMonetization() {
    try {
      const response = await (<any>(
        api.delete('api/v2/payments/stripe/connect')
      ));
      return response;
    } catch (e) {
      logService.exception(e);
      return false;
    }
  },
  async loadEarnings(from, to) {
    try {
      const response = <any>await api.get(
        'api/v3/monetization/earnings/overview',
        {
          from: from,
          to: to,
        },
      );

      if (response.earnings) {
        this.usdEarnings = response.earnings;
      }

      if (response.payouts) {
        this.usdPayouts = response.payouts;
      }

      this.loadEarningsTotals();
    } catch (e) {
      logService.exception(e);
      return false;
    }
  },
  loadEarningsTotals() {
    const SUM_CENTS = (arr): number => {
      return arr.reduce((acc, item) => {
        return acc + item.amount_cents;
      }, 0);
    };

    if (this.usdEarnings.length > 0) {
      this.usdEarningsTotal = SUM_CENTS(this.usdEarnings);
    }

    if (this.usdPayouts.length > 0) {
      this.usdPayoutsTotals = SUM_CENTS(this.usdPayouts);
    }
  },
  async loadPrices() {
    if (this.prices.minds === '0') {
      const prices = <any>await api.get('api/v3/blockchain/token-prices');
      this.prices.minds = prices.minds;
      this.prices.eth = prices.eth;
    }
  },
  async loadRewards(date: Date) {
    this.loadPrices();
    try {
      const dateTs = getStartOfDayUnixTs(date);
      const formattedDate = moment(dateTs * 1000)
        .utc()
        .startOf('day')
        .format('Y-M-D');

      let rewards = <any>await api.get('api/v3/rewards/', {
        date: formattedDate,
      });
      const response = <any>await api.get('api/v2/blockchain/contributions', {
        from: dateTs,
        to: dateTs + 1,
      });
      const contributionScores: ContributionMetric[] = [];
      if (response.contributions && response.contributions.length > 0) {
        Object.keys(response.contributions[0].metrics).forEach(key => {
          const metric = response.contributions[0].metrics[key];
          metric.id = key;
          metric.label = metric.metric;
          contributionScores.push(metric);
        });
      }

      return { rewards, contributionScores };
    } catch (e) {
      logService.exception(e);
      return false;
    }
  },
  async loadLiquiditySummary(date: Date) {
    try {
      const dateTs = getStartOfDayUnixTs(date);
      return <any>await api.get('api/v3/blockchain/liquidity-positions', {
        timestamp: dateTs,
      });
    } catch (err) {
      return false;
    }
  },
  /**
   * Join to wallet tokens
   * @param {string} number
   * @param {boolean} retry
   */
  join(numberToJoin: string, retry: boolean): Promise<WalletJoinResponse> {
    return walletService.join(numberToJoin, retry);
  },
  /**
   * Confirm join
   * @param {string} number
   * @param {string} code
   * @param {string} secret
   */
  confirm(number, code, secret) {
    return walletService.confirm(number, code, secret);
  },
  reset() {
    this.balance = 0;
    this.stripeDetails = defaultStripeDetails;
    this.wallet = defaultWallet;
    this.usdEarnings = [];
    this.usdPayouts = [];
    this.usdEarningsTotal = 0;
    this.usdPayoutsTotals = 0;
  },
});

export default createWalletStore;

export type WalletStoreType = ReturnType<typeof createWalletStore>;
