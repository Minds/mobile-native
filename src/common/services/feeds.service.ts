import { isAbort, isNetworkError } from './ApiErrors';
import BaseModel from '../BaseModel';
import { Platform } from 'react-native';
import { GOOGLE_PLAY_STORE } from '../../config/Config';
import difference from 'lodash/difference';
import { FeedsStorage } from './storage/feeds.storage';
import type { ApiService } from './api.service';
import type { LogService } from './log.service';
import type { SessionService } from './session.service';
import type { EntitiesService } from './entities.service';
import type { Storages } from './storage/storages.service';
import type { BoostedContentService } from '~/modules/boost';

export const shouldInjectBoostAtIndex = (i: number) => i > 0 && i % 5 === 0;

export type FeedRecordType<T extends BaseModel = BaseModel> = {
  owner_guid?: string | null;
  timestamp: number | null;
  urn: string;
  entity?: T;
};

/**
 * Feed store
 */
export class FeedsService<T extends BaseModel = BaseModel> {
  /**
   * @var {boolean}
   */
  injectBoost: boolean = false;

  /**
   * @var {boolean}
   */
  asActivities: boolean = true;

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
   * @var {string}
   */
  countEndpoint: string = '';

  /**
   * @var {Record<string, any>}
   */
  params: Record<string, any> = { sync: 1 };

  /**
   * @var {Array}
   */
  feed: Array<FeedRecordType<T>> = [];

  /**
   * @var {string}
   */
  pagingToken: string = '';

  /**
   * @var {boolean}
   */
  endReached = false;

  /**
   * @var {boolean}
   */
  paginated = true;

  /**
   * @var {number|null}
   */
  fallbackAt = null;

  /**
   * @var {number}
   */
  fallbackIndex = -1;

  /**
   * the last time we checked for new posts
   */
  feedLastFetchedAt?: number;

  private boostedContent?: BoostedContentService;

  /**
   * @var {string}
   */
  dataProperty: string = 'entities';

  /**
   * @var {FeedsStorage}
   */
  feedStorage: FeedsStorage;

  constructor(
    private api: ApiService,
    private log: LogService,
    private session: SessionService,
    private entitiesService: EntitiesService,
    private storages: Storages,
    private boostedContentService: BoostedContentService,
  ) {
    this.feedStorage = new FeedsStorage(this.storages, this.log);
  }

  setDataProperty(name: string) {
    this.dataProperty = name;
    return this;
  }

  /**
   * Get entities from the current page
   */
  async getEntities(): Promise<Array<any>> {
    const end = this.limit + this.offset;

    if (this.paginated && end >= this.feed.length && !this.endReached) {
      try {
        await this.fetch(true);
      } catch (err) {
        if (!isNetworkError(err)) {
          this.log.exception('[FeedService] getEntities', err);
        }
      }
    }

    const feedPage = this.feed.slice(this.offset, end);

    const result: Array<any> = this.params.sync
      ? await this.entitiesService.getFromFeed(
          feedPage,
          this,
          this.asActivities,
        )
      : feedPage;

    if (!this.injectBoost || this.session.getUser()?.disabled_boost) {
      return result;
    }

    // wait for the boosts to load, otherwise, don't fail this request
    if (this.boostedContent && !this.boostedContent.boosts.length) {
      try {
        await this.boostedContent.load();
      } catch (e) {
        console.error('[FeedsService] failed to fetch boosts');
      }
    }

    for (let i = this.offset; i < this.offset + result.length; i++) {
      if (shouldInjectBoostAtIndex(i)) {
        const boost = (
          this.boostedContent ?? this.boostedContentService
        ).fetch();
        if (boost) {
          result.splice(i, 0, boost);
        }
      }
    }

    return result;
  }

  /**
   * Prepend entity
   * @param {BaseModel} entity
   */
  prepend(entity: BaseModel) {
    this.feed.unshift({
      owner_guid: entity.owner_guid,
      timestamp: Date.now(),
      urn: entity.urn,
    });

    this.offset++;
    this.fallbackIndex++;

    const plainEntity = entity.toPlainObject();

    this.entitiesService.save(plainEntity);
    // save without wait
    this.feedStorage.save(this);
  }

  /**
   * getter has More
   */
  get hasMore(): boolean {
    return this.feed.length > this.limit + this.offset;
  }

  /**
   * Set fallback index
   * @param {number} value
   */
  setFallbackIndex(value: number) {
    this.fallbackIndex = value;
  }

  /**
   * Set feed
   * @param {Array<FeedRecordType<T>>} feed
   * @returns {FeedsService}
   */
  setFeed(feed: Array<FeedRecordType<T>>): FeedsService {
    this.feed = feed;
    return this;
  }

  /**
   * Set inject boost
   * @param {boolean} injectBoost
   * @returns {FeedsService}
   */
  setInjectBoost(injectBoost: boolean): FeedsService {
    this.injectBoost = injectBoost;
    return this;
  }

  /**
   * Set inject boost
   * @param {boolean} injectBoost
   * @returns {FeedsService}
   */
  setBoostedContent(boostedContent: BoostedContentService): FeedsService {
    this.boostedContent = boostedContent;
    return this;
  }

  /**
   * Set limit
   * @param {number} limit
   * @returns {FeedsService}
   */
  setLimit(limit: number): FeedsService {
    this.limit = limit;
    return this;
  }

  /**
   * Set offset
   * @param {integer} offset
   * @returns {FeedsService}
   */
  setOffset(offset: number): FeedsService {
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

  /**
   * Set count endpoint
   * @param {string} endpoint
   * @returns {FeedsService}
   */
  setCountEndpoint(endpoint: string): FeedsService {
    this.countEndpoint = endpoint;
    return this;
  }

  /**
   * Set parameters
   * @param {Object} params
   */
  setParams(params: any): FeedsService {
    this.params = params;
    if (!params.sync) {
      this.params.sync = 1;
    }
    return this;
  }

  noSync(): FeedsService {
    this.params.sync = 0;
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
   * Set paginated
   * @param {boolean} paginated
   * @returns {FeedsService}
   */
  setPaginated(paginated: boolean): FeedsService {
    this.paginated = paginated;
    return this;
  }

  /**
   * Abort pending fetch
   */
  abort() {
    this.api.abort(this);
  }

  /**
   * Calculate the index of the fallback
   */
  calculateFallbackIndex = () => {
    let index = -1;

    if (this.fallbackAt) {
      index = this.feed.findIndex(
        r =>
          r.entity &&
          r.entity.time_created &&
          this.fallbackAt &&
          parseInt(r.entity.time_created, 10) < this.fallbackAt,
      );
    }

    if (index !== -1) {
      this.fallbackIndex = index;
    } else {
      this.fallbackIndex = -1;
    }
  };

  /**
   * Fetch
   * @param {boolean} more
   */
  async fetch(more: boolean = false): Promise<void> {
    const params: any = {
      ...this.params,
      ...{
        limit: 150,
        hide_reminds: false,
        as_activities: this.asActivities ? 1 : 0,
      },
    };

    // For iOS and play store force safe content
    if (Platform.OS === 'ios' || GOOGLE_PLAY_STORE) {
      params.nsfw = [];
    }

    if (this.paginated && more) {
      params.from_timestamp = this.pagingToken;
    }
    const fetchTime = Date.now();
    const response = await this.api.get<any>(this.endpoint, params, this);
    this.feedLastFetchedAt = fetchTime;

    if (response[this.dataProperty] && response[this.dataProperty].length) {
      if (response[this.dataProperty].length < params.limit) {
        this.endReached = true;
      }
      if (more) {
        this.feed = this.params.sync
          ? this.feed.concat(response[this.dataProperty])
          : difference(response[this.dataProperty], this.feed);
      } else {
        this.feed = response[this.dataProperty];
      }
      if (response.fallback_at) {
        this.fallbackAt = response.fallback_at;
        this.calculateFallbackIndex();
      } else {
        this.fallbackAt = null;
        this.fallbackIndex = -1;
      }
      this.pagingToken = response['load-next'];
    } else {
      this.endReached = true;

      // if there is no result and isn't a pagination request we clear the feed data
      if (!more) {
        this.feed = [];
      }
    }

    // save without wait
    this.feedStorage.save(this);
  }

  /**
   * Fetch feed from local cache
   * @returns {boolean} true if there is local data or false otherwise
   */
  async fetchLocal(): Promise<boolean> {
    try {
      const feed: any = await this.feedStorage.read(this);
      if (feed) {
        // support old format
        if (Array.isArray(feed)) {
          this.feed = feed as Array<FeedRecordType<T>>;
          const last = this.feed[this.feed.length - 1];
          this.pagingToken = last.timestamp
            ? (last.timestamp - 1).toString()
            : '';
        } else {
          this.feed = feed.feed;
          this.fallbackAt = feed.fallbackAt;
          this.fallbackIndex = feed.fallbackIndex;
          this.pagingToken = feed.next;
        }
        return true;
      }
    } catch (err) {
      this.log.error('[FeedService] error loading local data');
    }

    return false;
  }

  /**
   * Fetch feed from local cache or from the remote endpoint if there is no cached data
   */
  async fetchLocalOrRemote(): Promise<void> {
    const status = await this.fetchLocal();

    try {
      if (!status) {
        await this.fetch();
      }
    } catch (err) {
      if (isAbort(err)) {
        return;
      }

      if (!isNetworkError(err)) {
        this.log.exception('[FeedService]', err);
      }

      throw err;
    }
  }

  /**
   * Fetch from the remote endpoint and if it fails from local cache
   */
  async fetchRemoteOrLocal(): Promise<void> {
    try {
      await this.fetch();
    } catch (err) {
      if (isAbort(err)) {
        return;
      }

      if (!isNetworkError(err)) {
        this.log.exception('[FeedService]', err);
      }

      if (!(await this.fetchLocal())) {
        // if there is no local data rethrow the exception
        throw err;
      }
    }
  }

  /**
   * Remove all from owner
   * @param {string} guid
   */
  removeFromOwner(guid: string) {
    let count = this.feed.length;
    this.feed = this.feed.filter(e => !e.owner_guid || e.owner_guid !== guid);
    count -= this.feed.length;
    this.offset -= count;
    this.feedStorage.save(this);
  }

  /**
   * Move offset to next page
   */
  next(): FeedsService {
    this.offset += this.limit;
    return this;
  }

  /**
   * Clear the store
   */
  clear(): FeedsService {
    this.offset = 0;
    this.fallbackAt = null;
    this.fallbackIndex = -1;
    this.pagingToken = '';
    this.feed = [];
    return this;
  }

  /**
   * counts newsfeed posts created after fromTimestamp
   * @param { number } fromTimestamp
   * @returns { Promise<number> }
   */
  async count(fromTimestamp?: number): Promise<number> {
    if (!this.countEndpoint) {
      throw new Error('[FeedsService] No count endpoint');
    }

    if (!fromTimestamp) {
      throw new Error('[FeedsService] No fromTimestamp provided');
    }

    const params = {
      from_timestamp: fromTimestamp,
    };

    const result = await this.api.get<{ count: number }>(
      this.countEndpoint,
      params,
      this,
    );
    return result.count;
  }
}
