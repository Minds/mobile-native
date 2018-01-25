import {
  observable,
  computed,
  action
} from 'mobx';

import walletService from '../WalletService';
import OffsetListStore from '../../common/stores/OffsetListStore';

export default class TokensStore {
  list = new OffsetListStore('shallow');
  loading = false;

  /**
   * Load list
   */
  loadList(from, to) {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    return walletService.getRewardsLedger(from, to, this.list.offset)
      .then(
        feed => {
          this.list.setList(feed);
          this.loaded = true;
        }
      )
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        console.log('error', err);
      });
  }

  @action
  refresh(from, to) {
    this.list.refresh();
    this.loadList(from, to)
      .finally(() => {
        this.list.refreshDone();
      });
  }
}