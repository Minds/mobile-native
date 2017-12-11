import {
  observable,
  action
} from 'mobx'

import walletService from './WalletService';

/**
 * Wallet store
 */
class WalletStore {

  @observable points = 0;

  loadCount() {
    walletService.getCount()
      .then(count => {
        this.setPoints(count);
      });
  }

  @action
  setPoints(p) {
    this.points = (p);
  }

  @action
  increase(delta) {
    this.points.set(this.points.get() + delta);
  }

  @action
  decrease(delta) {
    this.points.set(this.points.get() - delta);
  }
}

export default new WalletStore()