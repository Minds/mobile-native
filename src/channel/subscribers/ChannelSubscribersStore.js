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
  controller = null;

  loading = false;

  setGuid(guid) {
    this.guid = guid;

    this.loadList();
  }
  /**
   * Load boost list
   */
  loadList() {
    if (this.list.cantLoadMore()) {
      return Promise.resolve();
    }
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();

    this.loading = true;

    return channelService.getSubscribers(this.guid, this.filter, this.list.offset, this.controller.signal)
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