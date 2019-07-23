import { observable, action } from 'mobx';

import logService from '../services/log.service';
import Viewed from './Viewed';
import MetadataService from '../services/metadata.service';
import FeedsService from '../services/feeds.service';
import connectivityService from '../services/connectivity.service';

/**
 * Feed store
 */
export default class FeedStore {

  /**
   * Refreshing
   */
  @observable refreshing = false;

  /**
   * Loaded
   */
  @observable loaded = false;

  /**
   * Load error
   */
  @observable errorLoading = false;

  /**
   * Loading
   */
  @observable loading = false;

  /**
   * Is tiled
   */
  @observable isTiled = false;

  /**
   * feed observable
   */
  @observable.shallow entities = [];

  /**
   * Viewed store
   */
  viewed = new Viewed;

  /**
   * Metadata service
   */
  metadataService = null;

  /**
   * @var {FeedsService}
   */
  feedsService = new FeedsService;

  /**
   * Class constructor
   * @param {boolean} includeMetadata include a metadata service
   */
  constructor(includeMetadata = false) {
    if (includeMetadata) {
      this.metadataService = new MetadataService;
    }
  }

  /**
   * Add an entity to the viewed list and inform to the backend
   * @param {BaseModel} entity
   */
  async addViewed(entity) {
    return await this.viewed.addViewed(entity, this.metadataService)
  }

  /**
   * Get metadata service
   * @returns {MetadataService|undefined}
   */
  getMetadataService() {
    return this.metadataService;
  }

  /**
   * Set or add to the list
   * @param {BaseModel} list
   * @param {boolean} replace
   */
  @action
  addEntities(entities, replace = false) {
    if (replace) {
      entities.forEach((entity) => {
        entity._list = this;
      });
      this.entities = entities;
    } else {
      entities.forEach((entity) => {
        entity._list = this;
        this.entities.push(entity);
      });
    }

    this.loaded = true;
  }

  /**
   * Set loading
   * @param {boolean} value
   */
  @action
  setLoading(value) {
    this.loading = value;
    return this;
  }

  /**
   * Set is tiled
   * @param {boolean} value
   */
  @action
  setIsTiled(value): FeedStore {
    this.isTiled = value;
    return this;
  }

  /**
   * Set error loading
   * @param {boolean} value
   */
  @action
  setErrorLoading(value): FeedStore {
    this.errorLoading = value;
    return this;
  }

  /**
   * Prepend an entity
   * @param {BaseModel} entity
   */
  @action
  prepend(entity) {
    entity._list = this;
    this.entities.unshift(entity);
    this.feedsService.prepend(entity);
  }

  /**
   * Remove an entity by index
   * @param {integer} index
   */
  @action
  removeIndex(index) {
    this.entities.splice(index, 1);
  }

  /**
   * Remove the given entity from the list
   * @param {BaseModel} entity
   */
  remove(entity) {
    const index = this.entities.findIndex(e => e === entity);
    if (index < 0) return;
    this.removeIndex(index);
  }

  /**
   * Returns the index of the given entity
   * @param {BaseModel} entity
   */
  getIndex(entity) {
    return this.entities.findIndex(e => e === entity);
  }

  /**
   * Set endpoint for the feeds service
   * @param {string} endpoint
   */
  setEndpoint(endpoint: string): FeedStore {
    this.feedsService.setEndpoint(endpoint);
    return this;
  }

  /**
   * Set the params for the feeds service
   * @param {Object} params
   */
  setParams(params: Object): FeedStore {
    this.feedsService.setParams(params);
    return this;
  }

  /**
   * Set limit for the feeds service
   * @param {integer} limit
   */
  setLimit(limit): FeedStore {
    this.feedsService.setLimit(limit);
    return this;
  }

  /**
   * Set offset for the feeds service
   * @param {integer} offset
   */
  setOffset(offset): FeedStore {
    this.feedsService.setOffset(offset);
    return this;
  }

  /**
   * Set feed for the feeds service
   * @param {Array} feed
   */
  setFeed(feed): FeedStore {
    this.feedsService.setFeed(feed);
    return this;
  }

  /**
   * Set feed for the feeds service
   * @param {boolean} asActivities
   */
  setAsActivities(asActivities): FeedStore {
    this.feedsService.setAsActivities(asActivities);
    return this;
  }

  /**
   * Fetch from the endpoint
   */
  @action
  async fetch() {

    this
      .setLoading(true)
      .setErrorLoading(false);

    try {
      await this.feedsService.fetch();
      this.addEntities(await this.feedsService.getEntities());
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      logService.exception('[FeedStore]', err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Reload
   */
  reload() {
    if (this.entities.length) {
      this.loadMore();
    } else {
      this.fetch();
    }
  }

  /**
   * Hydrate current page
   */
  async hydratePage() {
    this.addEntities(await this.feedsService.getEntities());
  }

  /**
   * Fetch from local cache or remote if there is no local data
   * @param {boolean} refresh
   */
  async fetchLocalOrRemote(refresh = false) {
    this
      .setLoading(true)
      .setErrorLoading(false);

    try {
      await this.feedsService.fetchLocalOrRemote();
      if (refresh) this.setOffset(0);
      const entities = await this.feedsService.getEntities();
      if (refresh) this.clear();
      this.addEntities(entities);
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      logService.exception('[FeedStore]', err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Fetch from remote endpoint or from the local storage if it fails
   * @param {boolean} refresh
   */
  async fetchRemoteOrLocal(refresh = false) {
    this
      .setLoading(true)
      .setErrorLoading(false);

    try {
      await this.feedsService.fetchRemoteOrLocal();
      if (refresh) this.setOffset(0);
      const entities = await this.feedsService.getEntities();
      if (refresh) this.clear();
      this.addEntities(entities);
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      console.log(err);
      logService.exception('[FeedStore]', err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Load next page
   */
  async loadMore() {
    if (this.loading || !this.loaded || !this.feedsService.hasMore) return;

    this
      .setLoading(true)
      .setErrorLoading(false);

    try {
      this.addEntities(
        await this.feedsService
          .next()
          .getEntities()
      );
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      logService.exception('[FeedStore]', err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Refresh
   */
  @action
  async refresh() {
    this.refreshing = true;
    try {
      await this.fetchRemoteOrLocal(true);
    } finally {
      this.refreshing = false;
    }
  }

  /**
   * Clear store
   */
  @action
  clear(): FeedStore {
    this.refreshing = false;
    this.errorLoading = false;
    this.loaded = false;
    this.loading = false;
    this.entities = [];
    this.feedsService.setOffset(0);
    return this;
  }
}
