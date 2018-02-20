import {
  observable,
  computed,
  action
} from 'mobx'

import walletService from './WalletService';
import abbrev from "../common/helpers/abbrev";
import token from "../common/helpers/token";
import number from "../common/helpers/number";
import TokensStore from './tokens/TokensStore';
import storageService from '../common/services/storage.service';
/**
 * Wallet store
 */
class WalletStore {

  @observable balance = -1;
  @observable addresses = [];

  @observable onboardingShown = false;

  ledger = new TokensStore();

  refreshing = false;
  loaded = false;

  async refresh(force = false) {
    if ((this.refreshing || this.loaded) && !force) {
      return;
    }

    this.refreshing = true;
  

    const { balance, addresses } = await walletService.getBalances();
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
   */
  join(number) {
    return walletService.join(number)
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

  async reset() {
    // Onboarding
    this.onboardingShown = false;
    await storageService.removeItem('walletOnboardingComplete');
  }
}

export default new WalletStore()
