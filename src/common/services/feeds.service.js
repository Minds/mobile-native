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

  async getEntities() {
    const feedPage = this.feed.slice(this.offset, this.limit + this.offset);
    return await entitiesService.getFromFeed(feedPage, this);
  }

  get hasMore() {
    return this.feed.length > this.limit + this.offset;
  }

  setFeed(feed) {
    this.feed = feed;
    return this;
  }

  setLimit(limit) {
    this.limit = limit;
    return this;
  }

  setOffset(offset) {
    this.offset = offset;
    return this;
  }

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
    return this;
  }

  setParams(params): FeedStore {
    this.params = params;
    if (!params.sync) {
      this.params.sync = 1;
    }
    return this;
  }

  async fetch() {
    abort(this);
    const response = await apiService.get(this.endpoint, {...this.params, ...{ limit: 150 }}, this);

    this.feed = response.entities;

    // save without wait
    feedsStorage.save(this);
    return true;
  }

  async fetchLocal() {
    const feed = await feedsStorage.read(this);

    if (feed) {
      this.feed = feed;
      return true;
    }
    return false;
  }

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

  next() {
    this.offset += this.limit;
    return this;
  }

  clear(): FeedStore {
    this.offset = 0;
    this.params =  {sync: 1};
    this.feed = [];
    return this;
  }
}
