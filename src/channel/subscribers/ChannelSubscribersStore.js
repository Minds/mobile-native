import {
  observable,
  action
} from 'mobx'

import OffsetListStore from '../../common/stores/OffsetListStore';
import channelService from '../ChannelService';

/**
 * Subscribers Store
 */
class ChannelSubscribersStore {
  list = new OffsetListStore();
  @observable filter = 'subscribers';
  guid = '';

  loading = false;

  setGuid(guid) {
    let reload = (this.guid != guid);
    this.guid = guid;
    this.loadList(reload);
  }

  /**
   * Load boost list
   */
  loadList(reload = false) {

    if (this.list.cantLoadMore()) {
      return Promise.resolve();
    }

    if(reload)
      this.list.clearList();

    this.loading = true;

    return channelService.getSubscribers(this.guid, this.filter, this.list.offset)
      .then( feed => {
        this.list.setList(feed);
      })
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        // ignore aborts
        if (err.code === 'Abort') return;
        console.log('error', err);
      })
  }

  @action
  reset() {
    this.guid = null;
    this.list.clearList();
    this.filter = 'subscribers';
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
    this.loading = false;
    this.list.clearList();
    this.loadList();
  }
}

export default ChannelSubscribersStore;