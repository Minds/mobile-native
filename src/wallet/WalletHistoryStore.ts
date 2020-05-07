//@ts-nocheck
import { observable, action } from 'mobx';

import OffsetListStore from '../common/stores/OffsetListStore';
import walletService from './WalletService';
import logService from '../common/services/log.service';

/**
 * WalletHistory Store
 */
class WalletHistoryStore {
  /**
   * WalletHistory list store
   */
  list = new OffsetListStore();

  /**
   * List loading
   */
  loading = false;

  /**
   * Load boost list
   */
  loadList() {
    if (this.list.cantLoadMore() || this.loading) {
      return;
    }
    this.loading = true;
    return walletService
      .getHistory(this.list.offset, this.filter)
      .then((feed) => {
        this.list.setList(feed);
      })
      .finally(() => {
        this.loading = false;
      })
      .catch((err) => {
        logService.exception('[WalletHistoryStore]', err);
      });
  }

  /**
   * Refresh list
   */
  refresh() {
    this.list.refresh();
    this.loadList().finally(() => {
      this.list.refreshDone();
    });
  }
  /**
   * Stop polling unread count
   */
  stopPollCount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  @action reset() {
    this.loading = false;
    this.list = new OffsetListStore();
  }
}

export default WalletHistoryStore;
