import { action } from 'mobx';

import OffsetListStore from '../../common/stores/OffsetListStore';
import { ListFiltersType } from '../v2/TransactionList/TransactionsListTypes';
import sp from '~/services/serviceProvider';

export default class TokensStore {
  list = new OffsetListStore('shallow');
  loading = false;
  loaded = false;
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
        ? sp.resolve('wallet').getTransactionsLedger
        : sp.resolve('wallet').getContributions;

    return fetchFn(from, to, this.list.offset)
      .then(feed => {
        this.list.setList(feed);
        this.loaded = true;
      })
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        sp.log.exception('[TokensStore]', err);
      });
  }

  @action
  async loadTransactionsListAsync(
    filters: ListFiltersType,
    callback?: () => any,
  ) {
    if (this.list.cantLoadMore() || this.loading) {
      return false;
    }
    this.loading = true;

    try {
      const feed = await sp
        .resolve('wallet')
        .getFilteredTransactionsLedger(filters, this.list.offset);

      this.list.setList(feed, false, callback);
      this.loaded = true;
    } catch (err) {
      sp.log.exception('[TokensStore]', err);
    } finally {
      this.loading = false;
    }
  }

  @action
  async refreshTransactionsList(
    filters: ListFiltersType,
    callback?: () => any,
  ) {
    this.list.refresh();
    await this.loadTransactionsListAsync(filters, callback);
    this.list.refreshDone();
  }

  @action
  refresh(from, to) {
    this.list.refresh();
    this.loadList(from, to).finally(() => {
      this.list.refreshDone();
    });
  }
}
