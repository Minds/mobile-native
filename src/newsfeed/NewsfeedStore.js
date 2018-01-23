import { observable, action } from 'mobx'

import { getFeedTop, getFeed, getBoosts } from './NewsfeedService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
/**
 * News feed store
 */
class NewsfeedStore {

  @observable list = new OffsetFeedListStore();

  @observable filter = 'subscribed';

  @observable.ref boosts = [];

  /**
   * List loading
   */
  loading = false;

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
   * Set filter
   * @param {string} filter
   */
  @action
  setFilter(filter) {
    this.filter = filter;
    this.refresh();
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
  loadBoosts() {
    // get first 15 boosts
    getBoosts('', 15)
      .then(boosts => {
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

}

export default new NewsfeedStore();