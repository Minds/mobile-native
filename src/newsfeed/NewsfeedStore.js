import { Alert } from 'react-native';
import { observable, action, computed } from 'mobx'

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
        loading: false,
      },
      'suggested': {
        list: new OffsetFeedListStore('shallow'),
        loading: false,
      },
      'boostfeed': {
        list: new OffsetFeedListStore('shallow'),
        loading: false,
      },
    };
  }

  /**
   * Load feed
   */
  async loadFeed(refresh = false) {
    const store = this.stores[this.filter];
    const fetchFn = this.fetch;

    if (store.list.cantLoadMore() || store.loading) {
      return Promise.resolve();
    }

    store.loading = true;

    try {
      const feed = await fetchFn(this.list.offset)

      //Alert.alert('got feed with ' + feed.entities.length + ' items');

      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      store.list.setList(feed, refresh);
      this.loaded = true;
    } catch (err) {
      console.log('error', err);
    } finally {
      store.loading = false;
    }
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.filter}:${this.list.entities.length}`;
    });
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
    this.refresh();
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
    this.loadingBoost = true;
  }

}

export default NewsfeedStore;