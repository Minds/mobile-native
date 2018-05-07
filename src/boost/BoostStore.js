import {
  observable,
  action
} from 'mobx'

import OffsetListStore from '../common/stores/OffsetListStore';
import { getBoosts, revokeBoost, rejectBoost, acceptBoost} from './BoostService';

import BoostModel from './BoostModel';
import BoostService from './BoostService';

/**
 * Boosts Store
 */
class BoostStore {

  /**
   * Boost list store
   */
  @observable list = new OffsetListStore();

  service = new BoostService();

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
  async loadList(refresh = false) {
    if (this.list.cantLoadMore() || this.loading) {
      return;
    }
    this.loading = true;

    try {
      const peer_filter = this.filter === 'peer' ? this.peer_filter : null;
      const feed = await this.service.getBoosts(this.list.offset, this.filter, peer_filter);
      this.assignRowKeys(feed);
      feed.entities = BoostModel.createMany(feed.entities);
      this.list.setList(feed, refresh);
    } catch(err) {
      console.log('error', err);
    } finally {
      this.loading = false;
    }
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
  async refresh() {
    await this.list.refresh();
    await this.loadList();
    this.list.refreshDone();
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

export default BoostStore;