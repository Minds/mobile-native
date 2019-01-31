import { Alert } from 'react-native';
import { observable, action, computed, extendObservable } from 'mobx'

import NewsfeedService, { getBoosts, setViewed } from './NewsfeedService';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import ActivityModel from './ActivityModel';

/**
 * News feed store
 */
class NewsfeedStore {

  stores;

  service = new NewsfeedService;

  viewed = [];
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
  }

  buildStores() {
    this.stores = {
      'subscribed': {
        list: new OffsetFeedListStore('shallow'),
      },
      'suggested': {
        list: new OffsetFeedListStore('shallow'),
      },
      'boostfeed': {
        list: new OffsetFeedListStore('shallow'),
      },
    };

    extendObservable(this.stores.subscribed,{
      loading: false
    });
    extendObservable(this.stores.suggested,{
      loading: false
    });
    extendObservable(this.stores.boostfeed,{
      loading: false
    });
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

      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed, store);
      store.list.setList(feed, refresh);
      this.loaded = true;
    } catch (err) {
      console.log('error', err);
      store.list.setErrorLoading(true);
    } finally {
      store.loading = false;
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

  @action
  async addViewed(entity) {
    if (this.viewed.indexOf(entity.guid) < 0) {
      let response;
      try {
        response = await setViewed(entity);
        if (response) {
          this.viewed.push(entity.guid);
        }
      } catch (e) {
        throw new Error('There was an issue storing the view');
      }
    }
  }

  /**
   * return service method based on filter
   */
  get fetch() {
    switch (this.filter) {
      case 'subscribed':
        return this.service.getFeed.bind(this.service);
      case 'suggested':
        return this.service.getFeedSuggested.bind(this.service);
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
    getBoosts('', 15, rating)
      .then(boosts => {
        this.loadingBoost = false;
        this.boosts = boosts.entities;
      })
  }

  prepend(entity) {
    const model = ActivityModel.create(entity)

    model.rowKey = `${model.guid}:0:${this.list.entities.length}`

    this.list.prepend(model);
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
    await this.list.refresh();
    await this.loadFeed(true);
    this.list.refreshDone();
  }

  @action
  reset() {
    this.buildStores();
    this.filter = 'subscribed';
    this.boosts = [];
    this.viewed = [];
    this.loading = false;
    this.loadingBoost = false;
  }

}

export default NewsfeedStore;