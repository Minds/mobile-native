import { observable, action } from 'mobx';
import { fromStream } from 'mobx-utils'
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map, tap, catchError } from "rxjs/operators";

import logService from '../services/log.service';
import apiService from '../services/api.service';
import entitiesService from '../services/entities.service';

/**
 * Feed store
 */
export default class FeedStore {

  rawFeed: BehaviorSubject<Object[]> = new BehaviorSubject([]);

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
   * feed observable
   */
  feed;

  constructor() {
    this.feed = fromStream(
      this.rawFeed.pipe(
        tap(() => {
          this.setLoading(true);
        }),
        map(feed => feed.slice(0, this.limit + this.offset)),
        switchMap(feed => entitiesService.getFromFeed(feed)),
        catchError(err => {
          console.log('ERROR HANDLED!',err)
          this.setErrorLoading(true)
        }),
        tap(() => {
          this.setLoading(false);
        }),
      ),
      [] // initial value from the observable
    );
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
  async fetch() {
    this.setLoading(true);
    this.setErrorLoading(false)

    try {
      const response = await apiService.get(this.endpoint, {...this.params, ...{ limit: 150 }});
      this.rawFeed.next(response.entities);
    } catch (error) {
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  loadMore(): FeedStore {
    this.setErrorLoading(false)
    this.offset = this.limit + this.offset;
    this.rawFeed.next(this.rawFeed.getValue());
    return this;
  }

  @action
  clear(): FeedStore {
    this.offset = 0;
    this.refreshing = false;
    this.setLoading(false);
    this.rawFeed.next([]);
    return this;
  }

}
