import type { CurrencyType } from '../../types/Payment';
import api from '../../common/services/api.service';
import toFriendlyCrypto from '../../common/helpers/toFriendlyCrypto';
import logService from '../../common/services/log.service';
import web3Service from '../../blockchain/services/Web3Service';
import number from '../../common/helpers/number';
import { StripeDetails, Wallet } from './WalletTypes';

const createWalletStore = () => ({
  currency: 'tokens' as CurrencyType,

  stripeDetails: {
    hasAccount: false,
    hasBank: false,
    pendingBalanceSplit: 0,
    totalPaidOutSplit: 0,
    verified: false,
  } as StripeDetails,
  balance: 0 as number,
  wallet: {
    loaded: false,
    tokens: {
      label: 'Tokens',
      unit: 'tokens',
      balance: 0,
      address: null,
    },
    offchain: {
      label: 'Off-chain',
      unit: 'tokens',
      balance: 0,
      address: 'offchain',
    },
    onchain: {
      label: 'On-chain',
      unit: 'tokens',
      balance: 0, //eth balance
      address: null,
    },
    receiver: {
      label: 'Receiver',
      unit: 'tokens',
      balance: 0,
      address: null,
    },
    cash: {
      label: 'Cash',
      unit: 'cash',
      balance: 0,
      address: null,
    },
    eth: {
      label: 'Ether',
      unit: 'eth',
      balance: 0,
      address: null,
    },
    btc: {
      label: 'Bitcoin',
      unit: 'btc',
      balance: 0,
      address: null,
    },
    limits: {
      wire: 0,
    },
  } as Wallet,
  /**
   * Set currency tab
   * @param currency
   */
  setCurrent(currency: CurrencyType) {
    this.currency = currency;
  },
  /**
   * Load wallet data
   */
  async loadWallet(): Promise<void> {
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
      tokenTypes.forEach((type) => {
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
        response.addresses.forEach(async (address) => {
          if (address.address === 'offchain') {
            this.wallet.offchain.balance = toFriendlyCrypto(address.balance);
          } else if (address.label === 'Receiver') {
            this.wallet.receiver.balance = toFriendlyCrypto(address.balance);
            this.wallet.receiver.address = address.address;
            this.wallet.eth.balance = number(
              await web3Service.getBalance(address.address),
              3,
            );
          }
        });

        this.wallet.loaded = true;
      } else {
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
    } catch (e) {
      logService.exception(e);
    }
    return this.stripeDetails;
  },
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

    this.stripeDetails = { ...account, ...this.stripeDetails };

    this.stripeDetails = this.stripeDetails;
  },
});

export default createWalletStore;

export type WalletStoreType = ReturnType<typeof createWalletStore>;
