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
/**
 * Wallet store
 */
class WalletStore {

  @observable balance = -1;
  @observable addresses = [];

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

  // TODO: Implement forced auto-refresh every X minutes
  // TODO: Implement socket and atomic increases/decreases
}

export default new WalletStore()
