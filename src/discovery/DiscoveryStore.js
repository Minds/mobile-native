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
  @observable stores;

  @observable searchtext = '';
  @observable filter     = 'trending';
  @observable type       = 'object/image';
  @observable category   = 'all';

  constructor() {
    this.buildListStores();
  }

  /**
   * Build lists stores
   */
  buildListStores() {
    this.stores = {
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
    const store = this.stores[this.type];

    // ignore last visited channels
    if (type == 'lastchannels') return Promise.resolve();

    // no more data or loading? return
    if (this.list.cantLoadMore() || this.loading) {
      console.log('can not load more', this.list.cantLoadMore(), this.loading);
      return Promise.resolve();
    }

    this.loading = true;

    try {
      const feed = await discoveryService.getFeed(store.list.offset, this.type, this.filter, this.searchtext);
      this.createModels(type, feed, preloadImage);
      this.assignRowKeys(feed);
      this.list.setList(feed, refresh);
    } catch (err) {
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
      case 'object/image':
      case 'object/video':
        feed.entities = ActivityModel.createMany(feed.entities);
        if (preloadImage) {
          feed.entities.forEach(entity => {
            entity.preloadThumb();
          });
        }
        break;
      case 'object/blog':
        feed.entities = BlogModel.createMany(feed.entities);
        break;
      case 'user':
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
  clearList() {
    this.type = 'object/image';
    this.filter = 'trending';
  }

  /**
   * search
   * @param {string} text
   */
  @action
  search(text) {
    const list = this.stores[this.type].list;
    list.clearList();

    this.searchtext = text.trim();
    this.filter = 'search';

    if (text == '') {
      this.clearList();
    } else if ((text.indexOf('#') === 0) || (text.indexOf(' ') > -1)) {
      this.type = 'activity';
    } else {
      this.type = 'user';
    }

    return this.loadList(true);
  }

  @action
  reset() {
    this.buildListStores();

    this.searchtext = '';
    this.filter = 'trending';
    this.type  = 'object/image';
    this.category = 'all';
    this.loading = false;
  }
}

export default new DiscoveryStore();
