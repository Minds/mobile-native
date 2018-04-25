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


  @observable list = new OffsetListStore();
  @observable filter = 'subscribers';
  @observable guid = '';

  loading = false;

  setGuid(guid) {
    this.guid = guid;

    this.loadList();
  }
  /**
   * Load boost list
   */
  loadList() {
    if (this.list.cantLoadMore() || this.loading) {
      return;
    }
    this.loading = true;
    return channelService.getSubscribers(this.guid, this.filter, this.list.offset)
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

export default ChannelSubscribersStore;