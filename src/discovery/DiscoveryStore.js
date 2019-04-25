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
import NewsfeedFilterStore from '../common/stores/NewsfeedFilterStore';

/**
 * Discovery Store
 */
class DiscoveryStore {

  /**
   * Lists stores
   */
  stores;

  /**
   * Filter change reaction disposer
   */
  onFilterChangeDisposer;

  /**
   * Search change reaction disposer
   */
  onSearchChangeDisposer;

  constructor() {
    this.buildListStores();
    this.listenChanges();
  }

  /**
   * Listen for filter changes
   */
  listenChanges() {
    // react to filter changes
    this.onFilterChangeDisposer = this.filters.onFilterChange(this.onFilterChange);
    // react to search changes
    this.onSearchChangeDisposer = this.filters.onSearchChange(this.onSearchChange);
  }

  /**
   * Build lists stores
   */
  buildListStores() {

    this.filters = new NewsfeedFilterStore('hot', 'images', '12h', []);

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
      'activities': {
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
    extendObservable(this.stores.activities, {
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
    return this.stores[this.filters.type].list;
  }

  /**
   * set current list
   */
  set list(list) {
    this.stores[this.filters.type].list = list
  }

  /**
   * Load feed
   */
  @action
  async loadList(refresh = false, preloadImage = false, limit = 12) {
    const type = this.filters.type;
    const filter = this.filters.filter;

    // NOTE: we do not rely on this.list because it could change during the await
    const store = this.stores[type];

    // ignore last visited channels
    if (type == 'lastchannels') return;

    // no more data or loading? return
    if (!refresh && (store.list.cantLoadMore() || store.loading)) {
      return;
    }

    store.list.setErrorLoading(false);

    this.setLoading(store, true);

    try {
      const feed = await discoveryService.getTopFeed(
        store.list.offset,
        this.filters.type,
        this.filters.filter,
        this.filters.period,
        this.filters.nsfw.concat([]),
        this.filters.searchtext,
        limit
      );

      // if the filter has changed during the call we ignore the results
      if (filter === this.filters.filter) {
        this.createModels(type, feed, preloadImage);
        this.assignRowKeys(feed);
        store.list.setList(feed, refresh);
      }
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') {
        return;
      }
      if (!(typeof err === 'TypeError' && err.message === 'Network request failed')) {
        logService.exception('[DiscoveryStore]', err);
      }
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
    return this.stores[this.filters.type].loading;
  }

  set loading(val) {
    return this.stores[this.filters.type].loading = val;
  }

  createModels(type, feed, preloadImage) {
    switch (type) {
      case 'activities':
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
    const store = this.stores[this.filters.type];

    await store.list.refresh();
    await this.loadList(true);
    store.list.refreshDone();
  }

  /**
   * On filter changes
   * @param {string} filter
   * @param {string} type
   * @param {string} period
   * @param {string} searchtext
   */
  onFilterChange = (filter, type, period, nsfw) => {
    const store = this.stores[type];
    store.list.clearList();
    this.loadList(true);
  }

  /**
   * On search change
   */
  onSearchChange = (searchtext) => {
    const store = this.stores[this.filters.type];
    store.list.clearList();
    this.loadList(true);
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
    this.filters.type = 'images';
    this.filters.filter = 'hot';
  }

  @action
  reset() {
    this.onFilterChangeDisposer && this.onFilterChangeDisposer();
    this.onSearchChangeDisposer && this.onSearchChangeDisposer();
    this.filters.clear();
    this.listenChanges();
    this.stores.images.list.clearList();
    this.stores.videos.list.clearList();
    this.stores.blogs.list.clearList();
    this.stores.channels.list.clearList();
    this.stores.groups.list.clearList();
    this.stores.lastchannels.list.clearList();
    this.stores.activities.list.clearList();
    this.stores.images.loading = false;
    this.stores.videos.loading = false;
    this.stores.blogs.loading = false;
    this.stores.channels.loading = false;
    this.stores.groups.loading = false;
    this.stores.lastchannels.loading = false;
    this.stores.activities.loading = false;
  }
}

export default DiscoveryStore;
