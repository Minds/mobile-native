import {
  observable,
  action,
  computed,
  extendObservable
} from 'mobx';

import discoveryService from './DiscoveryService';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import OffsetListStore from '../common/stores/OffsetListStore';
import UserModel from '../channel/UserModel';
import GroupModel from '../groups/GroupModel';

/**
 * Discovery Store
 */
class DiscoveryLegacyStore {

  /**
   * Notification list store
   */
  stores;

  @observable searchtext   = '';
  @observable filter       = 'suggested';
  @observable type         = 'images';
  @observable category     = 'all';

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
      },
      'videos': {
        list: new OffsetListStore('shallow'),
      },
      'blogs': {
        list: new OffsetListStore('shallow'),
      },
      'channels': {
        list: new OffsetListStore('shallow'),
      },
      'groups': {
        list: new OffsetListStore('shallow'),
      },
      'lastchannels': {
        list: new OffsetListStore('shallow'),
      },
      'activity': {
        list: new OffsetListStore('shallow'),
      }
    };
    extendObservable(this.stores.images, {
      loading: false
    });
    extendObservable(this.stores.videos, {
      loading: false
    });
    extendObservable(this.stores.blogs, {
      loading: false
    });
    extendObservable(this.stores.channels, {
      loading: false
    });
    extendObservable(this.stores.groups, {
      loading: false
    });
    extendObservable(this.stores.lastchannels, {
      loading: false
    });
    extendObservable(this.stores.activity, {
      loading: false
    });
  }

  @action
  setLoading(store, value) {
    store.loading = value;
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
  async loadList(refresh = false, preloadImage = false) {
    const type = this.type;

    // NOTE: we do not rely on this.list because it could change during the await
    const store = this.stores[type];

    // ignore last visited channels
    if (type == 'lastchannels') return;

    // no more data or loading? return
    if ((!refresh && store.list.cantLoadMore()) || store.loading) {
      return;
    }

    store.list.setErrorLoading(false);

    this.setLoading(store, true);

    try {
      const feed = await discoveryService.getFeed(store.list.offset, this.type, this.filter, this.searchtext);

      this.createModels(type, feed, preloadImage);
      this.assignRowKeys(feed);
      store.list.setList(feed, refresh);
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      console.log('error', err);
      store.list.setErrorLoading(true);
    } finally {
      this.setLoading(store, false);
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
      case 'groups':
        feed.entities = GroupModel.createMany(feed.entities);
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
    // NOTE: we do not rely on this.list because it could change during the await
    const store = this.stores[this.type];

    await store.list.refresh();
    await this.loadList(true);
    store.list.refreshDone();
  }

  /**
   * Set type and refresh list
   * @param {string} type
   */
  @action
  setType(type) {
    const store = this.stores[type];
    this.type = type;
    store.list.clearList();
    this.loadList();
  }

  /**
   * Reload tje list
   */
  @action
  reload() {
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

    this.list.clearList();;

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

export default DiscoveryLegacyStore;
