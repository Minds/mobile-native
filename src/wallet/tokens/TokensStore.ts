//@ts-nocheck
import { action } from 'mobx';

import walletService from '../WalletService';
import OffsetListStore from '../../common/stores/OffsetListStore';
import logService from '../../common/services/log.service';

export default class TokensStore {
  list = new OffsetListStore('shallow');
  loading = false;
  mode = 'rewards';

  /**
   * Set mode
   * @param {string} rewards|contributions
   */
  setMode(mode) {
    this.mode = mode;
  }

  /**
   * Load list
   */
  loadList(from, to) {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    const fetchFn =
      this.mode === 'transactions'
        ? walletService.getTransactionsLedger
        : walletService.getContributions;

    return fetchFn(from, to, this.list.offset)
      .then((feed) => {
        this.list.setList(feed);
        this.loaded = true;
      })
      .finally(() => {
        this.loading = false;
      })
      .catch((err) => {
        logService.exception('[TokensStore]', err);
      });
  }

  async loadListAsync(from, to, callback) {
    if (this.list.cantLoadMore() || this.loading) {
      return false;
    }
    this.loading = true;

    try {
      const feed =
        this.mode === 'transactions'
          ? await walletService.getTransactionsLedger(
              from,
              to,
              this.list.offset,
            )
          : await walletService.getContributions(from, to, this.list.offset);

      this.list.setList(feed, false, callback);
      this.loaded = true;
    } catch (err) {
      logService.exception('[TokensStore]', err);
    } finally {
      this.loading = false;
    }
  }

  @action
  refresh(from, to) {
    this.list.refresh();
    this.loadList(from, to).finally(() => {
      this.list.refreshDone();
    });
  }
}
