import { fromStream } from 'mobx-utils'
import { observable, action } from 'mobx';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map, tap, catchError } from "rxjs/operators";

import logService from '../services/log.service';
import apiService from '../services/api.service';
import { abort } from '../helpers/abortableFetch';
import entitiesService from '../services/entities.service';
import Viewed from './Viewed';
import MetadataService from '../services/metadata.service';

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
   * Viewed store
   */
  viewed = new Viewed;

  /**
   * Metadata service
   */
  metadataService = null;

  /**
   * feed observable
   */
  @observable.shallow entities = [];

  constructor(includeMetadata = false) {
    if (includeMetadata) {
      this.metadataService = new MetadataService;
    }
    // this.feed = fromStream(
    //   this.rawFeed.pipe(
    //     tap((feed) => {
    //       this.setLoading(true);
    //       console.log('feed', feed)
    //     }),
    //     map(feed => feed.slice(0, this.limit + this.offset)),
    //     switchMap(feed => entitiesService.getFromFeed(feed)),
    //     tap((activities) => {
    //       this.setLoading(false);
    //       console.log('activities', activities)
    //     }),
    //     catchError(err => {
    //       console.log('ERROR HANDLED!',err)
    //       this.setErrorLoading(true)
    //     })
    //   ),
    //   [] // initial value from the observable
    // );
  }

  /**
   * Add an entity to the viewed list and inform to the backend
   * @param {BaseModel} entity
   */
  async addViewed(entity) {
    return await this.viewed.addViewed(entity, this.metadataService)
  }

  async updateEntities() {
    const feedPage = this.feed.slice(this.offset, this.limit + this.offset);
    const entities = await entitiesService.getFromFeed(feedPage, this);
    this.addEntities(entities);
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
      console.log(entities)
      entities.forEach((entity) => {
        entity._list = this;
        this.entities.push(entity);
      });
    }

    this.loaded = true;
  }

  setLimit(limit) {
    this.limit = limit;
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

  @action
  setLoading(value) {
    this.loading = value;
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

  @action
  async fetch() {

    this
      .setLoading(true)
      .setErrorLoading(false);

    try {
      abort(this);
      const response = await apiService.get(this.endpoint, {...this.params, ...{ limit: 150 }}, this);
      this.feed = response.entities;
      console.log(this.endpoint, this.feed)
      await this.updateEntities();
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;

      console.log(err)

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

  async loadMore() {
    if (this.loading) return;
    this.setLoading(true);
    this.setErrorLoading(false);
    this.offset += this.limit;
    try {
      await this.updateEntities();
    } catch (err) {
      console.log(err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  @action
  async refresh() {
    this.clear();
    this.refreshing = true;
    try {
      await this.fetch();
    } finally {
      this.refreshing = false;
    }
  }

  @action
  clear(): FeedStore {
    this.offset = 0;
    this.refreshing = false;
    this.errorLoading = false;
    this.loaded = false;
    this.setLoading(false);
    this.feed = [];
    this.entities = [];
    return this;
  }

}
