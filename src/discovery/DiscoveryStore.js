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
  stores = {
    'object/image': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'object/video': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'object/blog': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'user': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'group': {
      list: new OffsetListStore('shallow'),
      loading: false,
    }
  };

  list = new OffsetListStore('shallow');

  @observable searchtext = '';
  @observable filter     = 'featured';
  @observable type       = 'object/image';
  @observable category   = 'all';

  loading = false;

  /**
   * Load feed
   */
  async loadList(force=false) {
    const store = this.stores[this.type];
    // no more data or loading? return
    if (!force && store.list.cantLoadMore() || store.loading) {
      return Promise.resolve();
    }
    store.loading = true;
    return discoveryService.getFeed(store.list.offset, this.type, this.filter, this.searchtext)
      .then(feed => {
        store.list.setList(feed);
      })
      .finally(() => {
        store.loading = false;
      })
      .catch(err => {
        console.log('error', err);
      });
  }

  /**
   * Refresh list
   */
  refresh() {
    const list = this.stores[this.type].list;
    list.refresh();
    this.loadList()
      .finally(() => {
        list.refreshDone();
      });
  }

  /**
   * Set type and refresh list
   * @param {string} type
   */
  @action
  async setType(type) {
    const store = this.stores[this.type];
    this.type = type;
    this.loadList();
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
    const list = this.stores[this.type].list;
    list.clearList();
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
