import { observable, computed, action } from 'mobx';

import token from '../common/helpers/token';
import number from '../common/helpers/number';
import TokensStore from './tokens/TokensStore';
import type { ApiResponse } from '~/common/services/ApiResponse';
import { Timeout } from '~/types/Common';
import sp from '~/services/serviceProvider';

interface WalletResponse extends ApiResponse {
  balance: number;
  addresses: Array<Address>;
  boostCap: number;
  wireCap: number;
}

export type Address = {
  address: string;
  available?: number;
  balance: number;
  label: string;
  ethBalance?: number;
};

/**
 * Wallet store
 */
class WalletStore {
  @observable balance: number = -1;
  @observable addresses: Array<Address> = [];
  @observable overview: any = {};

  @observable onboardingShown: boolean = false;

  ledger = new TokensStore();

  refreshing: boolean = false;
  loaded: boolean = false;

  interval!: Timeout;

  isOnboardingShown!: boolean;

  @action
  async refresh(force: boolean = false): Promise<void> {
    if ((this.refreshing || this.loaded) && !force) {
      return;
    }

    this.refreshing = true;

    const { balance, addresses } = (await sp
      .resolve('wallet')
      .getBalances()) as WalletResponse;

    if (addresses && addresses.length > 0) {
      addresses.forEach(async address => {
        if (
          address.label.toLowerCase() !== 'offchain' &&
          address.address !== ''
        ) {
          //TODO: Balance now is now in the server response
          // address.ethBalance = await web3Service.getBalance(address.address);
        }
      });
    }

    const overview = await sp.resolve('wallet').getContributionsOverview();

    this.overview = overview;
    this.balance = balance;
    this.addresses = addresses;

    this.refreshing = false;
    this.loaded = true;
  }

  @computed get formattedBalance() {
    return this.balance > -1 ? number(token(this.balance, 18), 3) : '…';
  }

  /**
   * Join to wallet tokens
   * @param {string} number
   * @param {boolean} retry
   */
  join(number: string, retry: boolean) {
    return sp.resolve('wallet').join(number, retry);
  }

  /**
   * Confirm join
   * @param {string} number
   * @param {string} code
   * @param {string} secret
   */
  confirm(number, code, secret) {
    return sp.resolve('wallet').confirm(number, code, secret);
  }

  @action reset() {
    this.balance = -1;
    this.addresses = [];
    this.refreshing = false;
    this.loaded = false;
    this.overview = {
      contributionValues: {
        comments: 2,
        reminds: 4,
        votes: 1,
        subscribers: 4,
        referrals: 50,
        referrals_welcome: 50,
        checkin: 2,
        jury_duty: 25,
      },
    };
    this.onboardingShown = false;
    this.ledger = new TokensStore();
  }
}

export default WalletStore;
