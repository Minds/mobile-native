import { observable, action } from 'mobx'

import { getFeedTop, getFeed, getBoosts , setViewed} from './NewsfeedService';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import ActivityModel from './ActivityModel';

/**
 * News feed store
 */
class NewsfeedStore {

  list = new OffsetFeedListStore('shallow');

  viewed = [];
  @observable filter = 'subscribed';

  @observable.ref boosts = [];

  /**
   * List loading
   */
  loading = false;
  loadingBoost = true;
  /**
   * Load feed
   */
  loadFeed() {

    const fetchFn = this.getFetchFunction();

    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    return fetchFn(this.list.offset)
      .then(
        feed => {
          feed.entities = ActivityModel.createMany(feed.entities);
          this.assignRowKeys(feed);
          this.list.setList(feed);
          this.loaded = true;
        }
      )
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        console.log('error', err);
      });
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
  getFetchFunction() {
    switch (this.filter) {
      case 'subscribed':
        return getFeed;
      case 'top':
        return getFeedTop;
      case 'boostfeed':
        return getBoosts;
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
    this.list.prepend(entity);
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
  refresh() {
    this.list.refresh();
    this.loadFeed()
      .finally(() => {
        this.list.refreshDone();
      });
  }

  @action
  reset() {
    this.list = new OffsetFeedListStore('shallow');
    this.filter = 'subscribed';
    this.boosts = [];
    this.viewed = [];
    this.loading = false;
    this.loadingBoost = true;
  }

}

export default new NewsfeedStore();