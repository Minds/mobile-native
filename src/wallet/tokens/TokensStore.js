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
  loadList() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    return walletService.getRewardsLedger(new Date('2017-12-25 00:01:01'), new Date(), this.list.offset)
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
  refresh() {
    this.list.refresh();
    this.loadList()
      .finally(() => {
        this.list.refreshDone();
      });
  }
}