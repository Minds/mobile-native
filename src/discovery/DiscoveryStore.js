import {
  observable,
  action,
  computed,
} from 'mobx';

import discoveryService from './DiscoveryService';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import OffsetListStore from '../common/stores/OffsetListStore';
import UserModel from '../channel/UserModel';

/**
 * Discovery Store
 */
class DiscoveryStore {

  /**
   * Notification list store
   */
  stores;

  @observable searchtext = '';
  @observable filter     = 'suggested';
  @observable type       = 'images';
  @observable category   = 'all';

  constructor() {
    this.buildListStores();
  }

  /**
   * Build lists stores
   */
  buildListStores() {
    this.stores = {
      'images': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'videos': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'blogs': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'channels': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'groups': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'lastchannels': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'activity': {
        list: new OffsetListStore('shallow'),
        loading: false,
      }
    };
  }

  /**
   * get current list
   */
  @computed
  get list() {
    return this.stores[this.type].list;
  }

  /**
   * set current list
   */
  set list(list) {
    this.stores[this.type].list = list
  }

  /**
   * Load feed
   */
  @action
  async loadList(refresh=false, preloadImage=false) {
    const type = this.type;

    // NOTE: we do not rely on this.list because it could change during the await
    const store = this.stores[type];

    // ignore last visited channels
    if (type == 'lastchannels') return;

    // no more data or loading? return
    if (!refresh && store.list.cantLoadMore() || this.stores[type].loading) {
      return;
    }

    this.stores[type].loading = true;

    try {
      const feed = await discoveryService.getFeed(store.list.offset, this.type, this.filter, this.searchtext);
      this.createModels(type, feed, preloadImage);
      this.assignRowKeys(feed);
      store.list.setList(feed, refresh);
    } catch (err) {
      console.log('error', err);
    } finally {
      this.stores[type].loading = false;
    }
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
    });
  }

  @computed
  get loading() {
    return this.stores[this.type].loading;
  }

  set loading(val) {
    return this.stores[this.type].loading = val;
  }

  createModels(type, feed, preloadImage) {
    switch (type) {
      case 'activity':
      case 'images':
      case 'videos':
        feed.entities = ActivityModel.createMany(feed.entities);
        if (preloadImage) {
          feed.entities.forEach(entity => {
            entity.preloadThumb();
          });
        }
        break;
      case 'blogs':
        feed.entities = BlogModel.createMany(feed.entities);
        break;
      case 'channels':
        feed.entities = UserModel.createMany(feed.entities);
        break;
    }
  }

  /**
   * Refresh list
   */
  @action
  async refresh() {
    //can we refresh
    if (this.list.refreshing || this.loading) {
      return;
    }

    await this.list.refresh();
    await this.loadList(true);
    this.list.refreshDone();
  }

  /**
   * Set type and refresh list
   * @param {string} type
   */
  @action
  setType(type) {
    const store = this.stores[type];
    this.type = type;
    if (type == 'channels') {
      store.list.clearList();
    }
    this.loadList(type == 'channels');
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
  clearList() {
    this.type = 'images';
    this.filter = 'suggested';
  }

  /**
   * search
   * @param {string} text
   */
  @action
  search(text) {
    this.searchtext = text.trim();
    this.filter = 'search';
    this.loading = false;

    if (text.trim() == '') {
      this.clearList();
    } else if ((text.indexOf('#') === 0) || (text.indexOf(' ') > -1)) {
      this.type = 'activity';
    } else {
      this.type = 'channels';
    }

    const list = this.stores[this.type].list;
    list.clearList();

    return this.loadList(true);
  }

  @action
  reset() {
    this.buildListStores();

    this.searchtext = '';
    this.filter = 'suggested';
    this.type  = 'images';
    this.category = 'all';
    this.loading = false;
  }
}

export default DiscoveryStore;
