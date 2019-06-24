import {
  observable,
  action,
  computed,
  extendObservable
} from 'mobx';

import discoveryService from './DiscoveryService';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import UserModel from '../channel/UserModel';
import GroupModel from '../groups/GroupModel';
import NewsfeedFilterStore from '../common/stores/NewsfeedFilterStore';
import DiscoveryFeedStore from './DiscoveryFeedStore';
import logService from '../common/services/log.service';
import featuresService from '../common/services/features.service';
import boostedContentService from '../common/services/boosted-content.service';

/**
 * Discovery Store
 */
class DiscoveryStore {

  /**
   * FeedStore
   */
  feedStore;

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
    this.feedStore = new DiscoveryFeedStore(this.filters);
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
        list: new OffsetFeedListStore('shallow'),
      },
      'videos': {
        list: new OffsetFeedListStore('shallow'),
      },
      'blogs': {
        list: new OffsetFeedListStore('shallow', true),
      },
      'channels': {
        list: new OffsetFeedListStore('shallow', true),
      },
      'groups': {
        list: new OffsetFeedListStore('shallow'),
      },
      'lastchannels': {
        list: new OffsetFeedListStore('shallow'),
      },
      'activities': {
        list: new OffsetFeedListStore('shallow', true),
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

    this.stores.activities.list.getMetadataService()
      .setSource('feed/discovery')
      .setMedium('feed');

    this.stores.blogs.list.getMetadataService()
      .setSource('feed/discovery')
      .setMedium('feed');

    this.stores.channels.list.getMetadataService()
      .setSource('feed/discovery')
      .setMedium('feed');
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

         // inject boosts
        if (type === 'activities' && featuresService.has('es-feeds')) {
          await this.injectBoosts(feed, store.list);
        }

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
        logService.exception('[DiscoveryStore] loadList', err);
      }
      store.list.setErrorLoading(true);
    } finally {
      this.setLoading(store, false);
    }
  }

  /**
   * Inject boosts to the feed
   * @param {object} feed
   * @param {OffsetFeedListStore} list
   */
  async injectBoosts(feed, list) {
    const start = list.entities.length;
    const finish = feed.entities.length + start;

    if (finish > 40) return;

    await this.insertBoost(3, feed, start, finish);
    await this.insertBoost(8, feed, start, finish);
    await this.insertBoost(16, feed, start, finish);
    await this.insertBoost(24, feed, start, finish);
    await this.insertBoost(32, feed, start, finish);
    await this.insertBoost(40, feed, start, finish);
  }

  /**
   * Insert a boost in give position
   * @param {integer} position
   * @param {object} feed
   * @param {integer} start
   * @param {integer} finish
   */
  async insertBoost(position, feed, start, finish) {
    if (start <= position && finish >= position) {
      try {
        const boost = await boostedContentService.fetch();
        if (boost) feed.entities.splice( position + start, 0, boost );
      } catch (err) {
        logService.exception('[DiscoveryStore] insertBoost', err);
      }
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
    this.feedStore.reset();
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
