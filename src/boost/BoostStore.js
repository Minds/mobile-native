import {
  observable,
  action
} from 'mobx'

import OffsetFeedListStore from '../common/stores/OffsetListStore';
import { getBoosts } from './BoostService';

/**
 * Boosts Store
 */
class BoostStore {

  /**
   * Boost list store
   */
  @observable list = new OffsetFeedListStore();

  /**
   * Boosts list filter
   */
  @observable filter = 'newsfeed';

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
    return getBoosts(this.list.offset, this.filter)
      .then( feed => {
        this.list.setList(feed);
      })
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        console.log('error', err);
      })
  }

  /**
   * Refresh list
   */
  refresh() {
    this.list.refresh();
    this.loadList()
      .finally(() => {
        this.list.refreshDone();
      });
  }

  @action
  setFilter(filter) {
    this.filter = filter;
    this.list.clearList();
    this.loadList();
  }

}

export default new BoostStore();