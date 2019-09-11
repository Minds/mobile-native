import {
  observable,
  computed,
  action
} from 'mobx';

import moment from 'moment';
import walletService from './WalletService';
import abbrev from "../common/helpers/abbrev";
import token from "../common/helpers/token";
import number from "../common/helpers/number";
import TokensStore from './tokens/TokensStore';
import storageService from '../common/services/storage.service';
import web3Service from '../blockchain/services/Web3Service';


/**
 * Wallet store
 */
class WalletStore {

  @observable balance = -1;
  @observable addresses = [];
  @observable overview = {};

  @observable onboardingShown = false;

  ledger = new TokensStore();

  refreshing = false;
  loaded = false;

  @action
  clockTick() {
    this.overview.nextPayout--;
  }

  @action
  async refresh(force = false) {
    if ((this.refreshing || this.loaded) && !force) {
      return;
    }

    this.refreshing = true;

    const { balance, addresses } = await walletService.getBalances();

    if (addresses && addresses.length > 0) {
      addresses.forEach(async address => {
        if (address.label.toLowerCase() != 'offchain' && address.address !== '') {
          address.ethBalance = await web3Service.getBalance(address.address);
        }
      });
    }

    const overview = await walletService.getContributionsOverview();

    // next payout clock
    this.interval && clearInterval(this.interval);
    this.interval = setInterval(() => this.clockTick(), 1000);

    this.overview = overview;
    this.balance = balance;
    this.addresses = addresses;

    this.refreshing = false;
    this.loaded = true;
  }

  @computed get formattedBalance() {
    return this.balance > -1 ? number(token(this.balance, 18), 3) : '…'
  }

  /**
   * Join to wallet tokens
   * @param {string} number
   * @param {boolean} retry
   */
  join(number, retry) {
    return walletService.join(number, retry)
  }

  /**
   * Confirm join
   * @param {string} number
   * @param {string} code
   * @param {string} secret
   */
  confirm(number, code, secret) {
    return walletService.confirm(number, code, secret);
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
        jury_duty: 25
      }
    };
    this.onboardingShown = false;
    this.ledger = new TokensStore();
    storageService.removeItem('walletOnboardingComplete');
  }

  // TODO: Implement forced auto-refresh every X minutes
  // TODO: Implement socket and atomic increases/decreases

  // Onboarding

  async canShowOnboarding() {
    return !this.isOnboardingShown && !(await storageService.getItem('walletOnboardingComplete'));
  }

  @action setOnboardingShown(value) {
    this.isOnboardingShown = !!value;
  }

  async setOnboardingComplete(value) {
    await storageService.setItem('walletOnboardingComplete', !!value);
  }
}

export default WalletStore;
