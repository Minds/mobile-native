import { Alert } from 'react-native';
import { observable, action, computed, extendObservable } from 'mobx'

import NewsfeedService from './NewsfeedService';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import ActivityModel from './ActivityModel';
import logService from '../common/services/log.service';
import boostedContentService from '../common/services/boosted-content.service';
import featuresService from '../common/services/features.service';
import FeedStore from '../common/stores/FeedStore';

/**
 * News feed store
 */
class NewsfeedStore {

  feedStore = new FeedStore(true);

  // legacy
  stores;

  service = new NewsfeedService;

  @observable filter = 'subscribed';

  @observable.ref boosts = [];

  /**
   * List loading
   */
  loadingBoost = true;

  /**
   * Constructors
   */
  constructor() {
    this.buildStores();
    this.feedStore
      .setEndpoint(`api/v2/feeds/subscribed/activities`)
      .setLimit(12);
  }

  buildStores() {
    this.stores = {
      'subscribed': {
        list: new OffsetFeedListStore('shallow', true),
      },
      'boostfeed': {
        list: new OffsetFeedListStore('shallow', true),
      },
    };

    extendObservable(this.stores.subscribed, {
      loading: false
    });
    extendObservable(this.stores.boostfeed, {
      loading: false
    });

    this.feedStore.getMetadataService()
      .setSource('feed/subscribed')
      .setMedium('feed');

    this.stores.subscribed.list.getMetadataService()
      .setSource('feed/subscribed')
      .setMedium('feed');

    this.stores.boostfeed.list.getMetadataService()
      .setSource('feed/boosts')
      .setMedium('featured-content');
  }

  /**
   * Load feed
   */
  @action
  async loadFeed(refresh = false) {
    // reference the store because it may change after the await
    const store = this.store;
    const fetchFn = this.fetch;
    let feed;

    if (store.list.cantLoadMore() || store.loading) {
      return Promise.resolve();
    }

    store.list.setErrorLoading(false);

    store.loading = true;

    try {
      feed = await fetchFn(store.list.offset, 12);

      // inject boosts
      if (featuresService.has('es-feeds')) {
        await this.injectBoosts(feed);
      }

      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed, store);
      store.list.setList(feed, refresh);
      this.loaded = true;
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;

      store.list.setErrorLoading(true);

      if (!(typeof err === 'TypeError' && err.message === 'Network request failed')) {
        logService.exception('[NewsfeedStore] loadFeed', err);
      }
    } finally {
      store.loading = false;
    }
  }

  /**
   * Inject boosts to the feed
   * @param {object} feed
   */
  async injectBoosts(feed) {
    const start = this.list.entities.length;
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
        logService.exception('[NewsfeedStore] insertBoost', err);
      }
    }
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   * @param {object} store
   */
  assignRowKeys(feed, store) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${store.list.entities.length}`;
    });
  }

  get store() {
    return this.stores[this.filter]
  }

  get list() {
    return this.stores[this.filter].list;
  }

  get loading() {
    return this.stores[this.filter].loading;
  }

  set loading(val) {
    return this.stores[this.filter].loading = val;
  }

  /**
   * Set filter
   * @param {string} filter
   */
  @action
  setFilter(filter) {
    this.filter = filter;
    this.list.clearList();
    this.loadFeed(true, false);
  }

  /**
   * return service method based on filter
   */
  get fetch() {
    switch (this.filter) {
      case 'subscribed':
        return this.service.getFeed.bind(this.service);
      case 'boostfeed':
        return this.service.getBoosts.bind(this.service);
    }
  }

  /**
   * Load boosts
   */
  loadBoosts(rating) {
    // get first 15 boosts
    this.loadingBoost = true;
    this.service.getBoosts('', 15, rating)
      .then(boosts => {
        this.loadingBoost = false;
        this.boosts = boosts.entities;
      })
  }

  prepend(entity) {
    const model = ActivityModel.create(entity)

    model.rowKey = `${model.guid}:0:${this.list.entities.length}`

    if (featuresService.has('es-feeds')) {
      this.feedStore.prepend(model);
    } else {
      this.list.prepend(model);
    }
  }

  @action
  clearFeed() {
    this.list.clearList();
  }

  @action
  clearBoosts() {
    this.boosts = [];
  }

  @action
  async refresh() {
    // when refresh we report viewed again
    await this.list.refresh();
    await this.loadFeed(true);
    this.list.refreshDone();
  }

  @action
  reset() {
    this.buildStores();
    this.filter = 'subscribed';
    this.boosts = [];
    this.loading = false;
    this.loadingBoost = false;
    this.feedStore.clear();
  }

}

export default NewsfeedStore;