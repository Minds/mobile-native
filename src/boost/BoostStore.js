import {
  observable,
  action
} from 'mobx'

import OffsetListStore from '../common/stores/OffsetListStore';
import { getBoosts, revokeBoost, rejectBoost, acceptBoost} from './BoostService';
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

  @action
  revoke(guid) {
    let index = this.list.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.list.entities[index];
      return revokeBoost(guid, this.filter)
        .then(action(response => {
          entity.state = 'revoked';
          this.list.entities[index] = entity;
        }))
        .catch(action(err => {
          console.log('error');
        }));
    }
  }

  @action
  accept(guid) {
    let index = this.list.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.list.entities[index];
      return acceptBoost(guid, this.filter)
        .then(action(response => {
          entity.state = 'accepted';
          this.list.entities[index] = entity;
        }))
        .catch(action(err => {
          console.log('error');
        }));
    }
  }

  @action
  reject(guid) {
    let index = this.list.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.list.entities[index];
      return rejectBoost(guid, this.filter)
        .then(action(response => {
          entity.state = 'rejected';
          this.list.entities[index] = entity;
        }))
        .catch(action(err => {
          console.log('error');
        }));
    }
  }

}

export default new BoostStore();