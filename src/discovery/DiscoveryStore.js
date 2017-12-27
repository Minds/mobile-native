import {
  observable,
  action
} from 'mobx';

import discoveryService from './DiscoveryService';

import OffsetListStore from '../common/stores/OffsetListStore';

/**
 * Discovery Store
 */
class DiscoveryStore {
  /**
   * Notification list store
   */
  list = new OffsetListStore('shallow');

  @observable searchtext = '';
  @observable filter     = 'featured';
  @observable type       = 'object/image';
  @observable category   = 'all';

  loading = false;

  /**
   * Load feed
   */
  loadList(force=false) {
    // no more data or loading? return
    if (!force && this.list.cantLoadMore() || this.loading) {
      return;
    }
    this.loading = true;
    return discoveryService.getFeed(this.list.offset, this.type, this.filter, this.searchtext)
      .then(feed => {
        this.list.setList(feed);
      })
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        console.log('error', err);
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

  /**
   * Set type and refresh list
   * @param {string} type
   */
  @action
  setType(type) {
    this.type = type;
    this.list.clearList();
    this.loadList(true);
  }

  /**
   * Set filter and refresh list
   * @param {string} filter
   */
  @action
  setFilter(filter) {
    this.filter = filter;
    this.list.clearList();
    this.loadList(true);
  }

  @action
  reset() {
    this.type = 'object/image';
    this.filter = 'featured';
  }

  /**
   * search
   * @param {string} text
   */
  @action
  search(text) {
    this.list.clearList();
    this.searchtext = text;
    this.filter = 'search';

    if (text == '') {
      this.reset();
    } else if (text.indexOf("#") > -1) {
      this.type = "activity";
    } else {
      this.type = 'user';
    }
    this.loadList(true);
  }
}

export default new DiscoveryStore();
