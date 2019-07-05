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

  @action
  setLoading(value) {
    this.loading = value;
    return this;
  }

  @action
  setIsTiled(value) {
    this.isTiled = value;
    return this;
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
    return this;
  }

  @action
  prepend(entity) {
    entity._list = this;
    this.entities.unshift(entity);
  }

  @action
  removeIndex(index) {
    this.entities.splice(index, 1);
  }

  remove(entity) {
    const index = this.entities.findIndex(e => e === entity);
    if (index < 0) return;
    this.removeIndex(index);
  }

  getIndex(entity) {
    return this.entities.findIndex(e => e === entity);
  }


  setEndpoint(endpoint: string) {
    this.feedsService.setEndpoint(endpoint);
    return this;
  }

  setParams(params: Object) {
    this.feedsService.setParams(params);
    return this;
  }

  setLimit(limit) {
    this.feedsService.setLimit(limit);
    return this;
  }

  setOffset(offset) {
    this.feedsService.setOffset(offset);
    return this;
  }

  setFeed(feed) {
    this.feedsService.setFeed(feed);
    return this;
  }

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

  reload() {
    if (this.entities.length) {
      this.loadMore();
    } else {
      this.fetch();
    }
  }

  async hydratePage() {
    this.addEntities(await this.feedsService.getEntities());
  }

  async fetchLocalOrRemote(refresh = false) {
    this
      .setLoading(true)
      .setErrorLoading(false);

    try {
      await this.feedsService.fetchLocalOrRemote();
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

  async fetchRemoteOrLocal(refresh = false) {
    this
      .setLoading(true)
      .setErrorLoading(false);

    try {
      await this.feedsService.fetchRemoteOrLocal();
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

  @action
  async refresh() {
    this.refreshing = true;
    try {
      await this.fetchRemoteOrLocal(true);
    } finally {
      this.refreshing = false;
    }
  }

  @action
  clear(): FeedStore {
    this.refreshing = false;
    this.errorLoading = false;
    this.loaded = false;
    this.loading = false;
    this.entities = [];
    this.feedsService.clear();
    return this;
  }

}
