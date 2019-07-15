import logService from './log.service';
import apiService from './api.service';
import { abort, isNetworkFail } from '../helpers/abortableFetch';
import entitiesService from './entities.service';
import feedsStorage from './sql/feeds.storage';
import { showMessage } from 'react-native-flash-message';
import i18n from './i18n.service';

/**
 * Feed store
 */
export default class FeedsService {

  /**
   * @var {boolean}
   */
  asActivities = true;

  /**
   * @var {Number}
   */
  limit: number = 12;

  /**
   * @var {Number}
   */
  offset: number = 0;

  /**
   * @var {string}
   */
  endpoint: string = '';

  /**
   * @var {Object}
   */
  params = {sync: 1}

  /**
   * @var {Array}
   */
  feed = [];

  /**
   * Get entities from the current page
   */
  async getEntities() {
    const feedPage = this.feed.slice(this.offset, this.limit + this.offset);
    return await entitiesService.getFromFeed(feedPage, this, this.asActivities);
  }

  /**
   * getter has More
   */
  get hasMore() {
    return this.feed.length > this.limit + this.offset;
  }

  /**
   * Set feed
   * @param {Array} feed
   * @returns {FeedsService}
   */
  setFeed(feed): FeedsService {
    this.feed = feed;
    return this;
  }

  /**
   * Set limit
   * @param {integer} limit
   * @returns {FeedsService}
   */
  setLimit(limit): FeedsService {
    this.limit = limit;
    return this;
  }

  /**
   * Set offset
   * @param {integer} offset
   * @returns {FeedsService}
   */
  setOffset(offset): FeedsService {
    this.offset = offset;
    return this;
  }

  /**
   * Set endpoint
   * @param {string} endpoint
   * @returns {FeedsService}
   */
  setEndpoint(endpoint: string): FeedsService {
    this.endpoint = endpoint;
    return this;
  }

  setParams(params): FeedsService {
    this.params = params;
    if (!params.sync) {
      this.params.sync = 1;
    }
    return this;
  }

  /**
   * Set as activities
   * @param {boolean} asActivities
   * @returns {FeedsService}
   */
  setAsActivities(asActivities: boolean): FeedsService {
    this.asActivities = asActivities;
    return this;
  }

  /**
   * Fetch
   */
  async fetch() {
    abort(this);
    const response = await apiService.get(this.endpoint, {...this.params, ...{ limit: 150, as_activities: this.asActivities ? 1 : 0 }}, this);

    this.feed = response.entities;

    // save without wait
    feedsStorage.save(this);
    return true;
  }

  /**
   * Fetch feed from local cache
   */
  async fetchLocal() {
    const feed = await feedsStorage.read(this);

    if (feed) {
      this.feed = feed;
      return true;
    }
    return false;
  }

  /**
   * Fetch feed from local cache or from the remote endpoint if there is no cached data
   */
  async fetchLocalOrRemote() {

    let status;

    try {
      status = await this.fetchLocal();
      if (!status) await this.fetch();
    } catch (err) {

      if (err.code === 'Abort') return;

      logService.exception('[FeedService]', err);
      await this.fetch();
    }
  }

  /**
   * Fetch from the remote endpoint and if it fails from local cache
   */
  async fetchRemoteOrLocal() {

    let status;

    try {
      status = await this.fetch();
      if (!status) await this.fetchLocal();
    } catch (err) {

      if (err.code === 'Abort') return;

      if (!isNetworkFail(err)) {
        logService.exception('[FeedService]', err);
      }

      await this.fetchLocal();

      showMessage({
        position: 'center',
        message: i18n.t('cantReachServer'),
        description: i18n.t('showingStored'),
        type: "default",
      });
    }
  }

  /**
   * Move offset to next page
   */
  next(): FeedStore  {
    this.offset += this.limit;
    return this;
  }

  /**
   * Clear the store
   */
  clear(): FeedStore {
    this.offset = 0;
    this.limit = 12;
    this.params =  {sync: 1};
    this.feed = [];
    return this;
  }
}
