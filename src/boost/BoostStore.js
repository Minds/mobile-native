import {
  observable,
  action
} from 'mobx'

import OffsetListStore from '../common/stores/OffsetListStore';
import { getBoosts, revokeBoost, rejectBoost, acceptBoost} from './BoostService';

import BoostModel from './BoostModel';

/**
 * Boosts Store
 */
class BoostStore {

  /**
   * Boost list store
   */
  @observable list = new OffsetListStore();

  /**
   * Boosts list filter
   */
  @observable filter = 'newsfeed';
  @observable peer_filter = 'inbox';

  /**
   * List loading
   */
  @observable loading = false;

  /**
   * Load boost list
   */
  loadList() {
    if (this.list.cantLoadMore() || this.loading) {
      return;
    }
    this.loading = true;
    return getBoosts(this.list.offset, this.filter, this.filter === 'peer'? this.peer_filter: null)
      .then( feed => {
        this.assignRowKeys(feed);
        feed.entities = BoostModel.createMany(feed.entities);
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
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    if (!feed.entities) return;
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
    });
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

  @action
  setPeerFilter(filter) {
    this.peer_filter = filter;
    this.list.clearList();
    this.loadList();
  }

  @action
  reset() {
    this.list = new OffsetListStore();
    this.filter = 'newsfeed';
    this.peer_filter = 'inbox';
    this.loading = false;
  }

}

export default new BoostStore();