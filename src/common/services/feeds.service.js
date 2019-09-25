// @flow
import logService from './log.service';
import apiService from './api.service';
import { abort, isNetworkFail } from '../helpers/abortableFetch';
import entitiesService from './entities.service';
import feedsStorage from './sql/feeds.storage';
import { showMessage } from 'react-native-flash-message';
import i18n from './i18n.service';
import connectivityService from './connectivity.service';
import Colors from '../../styles/Colors';
import boostedContentService from './boosted-content.service';
import BaseModel from '../BaseModel';

export type FeedRecordType = {
  owner_guid: string,
  timestamp: string,
  urn: string,
  entity?: Object
};

/**
 * Feed store
 */
export default class FeedsService {

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
   * @var {Object}
   */
  params: Object = {sync: 1}

  /**
   * @var {Array}
   */
  feed: Array<FeedRecordType> = [];

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
   * Get entities from the current page
   */
  async getEntities(): Promise<Array<any>> {
    const end = this.limit + this.offset;

    if (this.paginated && end >= this.feed.length && !this.endReached) {
      try {
        await this.fetch(true);
      } catch (err) {
        if (!isNetworkFail(err)) {
          logService.exception('[FeedService] getEntities', err);
        }
      }
    }

    const feedPage = this.feed.slice(this.offset, end);

    const result: Array<any> = await entitiesService.getFromFeed(feedPage, this, this.asActivities);

    if (!this.injectBoost) return result;

    this.injectBoosted(3, result, end);
    this.injectBoosted(8, result, end);
    this.injectBoosted(16, result, end);
    this.injectBoosted(24, result, end);
    this.injectBoosted(32, result, end);
    this.injectBoosted(40, result, end);

    return result;
  }

  /**
   * Inject boost at given position
   *
   * @param {number} position
   * @param {Array<ActivityModel>} entities
   * @param {number} end
   */
  injectBoosted(position: number, entities: Array<BaseModel>, end: number) {
    if (this.offset <= position && end >= position) {
      const boost =  boostedContentService.fetch();
      if (boost) entities.splice( position + this.offset, 0, boost );
    }
  }

  /**
   * Prepend entity
   * @param {BaseModel} entity
   */
  prepend(entity: BaseModel) {
    this.feed.unshift({
      owner_guid: entity.owner_guid,
      timestamp: Date.now().toString(),
      urn: entity.urn
    });

    this.offset++;

    const plainEntity = entity.toPlainObject();

    entitiesService.addEntity(plainEntity, true);
    // save without wait
    feedsStorage.save(this);
  }

  /**
   * getter has More
   */
  get hasMore(): boolean {
    return this.feed.length > this.limit + this.offset;
  }

  /**
   * Set feed
   * @param {Array<FeedRecordType>} feed
   * @returns {FeedsService}
   */
  setFeed(feed: Array<FeedRecordType>): FeedsService {
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
   * Set parameters
   * @param {Object} params
   */
  setParams(params: Object): FeedsService {
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
    abort(this);
  }

  /**
   * Fetch
   * @param {boolean} more
   */
  async fetch(more: boolean = false): Promise<void> {
    abort(this);

    const params = {...this.params, ...{ limit: 150, as_activities: this.asActivities ? 1 : 0 }};

    if (this.paginated && more) params.from_timestamp = this.pagingToken;
    const response = await apiService.get(this.endpoint, params, this);

    if (response.entities && response.entities.length) {
      if (more) {
        this.feed = this.feed.concat(response.entities);
      } else {
        this.feed = response.entities;
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
    feedsStorage.save(this);
  }

  /**
   * Fetch feed from local cache
   * @returns {boolean} true if there is local data or false otherwise
   */
  async fetchLocal(): Promise<boolean> {
    try {
      const feed = await feedsStorage.read(this);
      if (feed) {
        // support old format
        if (Array.isArray(feed)) {
          this.feed = feed;
          this.pagingToken = (this.feed[this.feed.length - 1].timestamp - 1).toString();
        } else {
          this.feed = feed.feed;
          this.pagingToken = feed.next;
        }
        return true;
      }
    } catch (err) {
      logService.error('[FeedService] error loading local data')
    }

    return false;
  }

  /**
   * Fetch feed from local cache or from the remote endpoint if there is no cached data
   */
  async fetchLocalOrRemote(): Promise<void> {
    const status = await this.fetchLocal();

    try {
      if (!status) await this.fetch();
    } catch (err) {
      if (err.code === 'Abort') return;

      if (!isNetworkFail(err)) {
        logService.exception('[FeedService]', err);
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
      if (err.code === 'Abort') return;

      if (!isNetworkFail(err)) {
        logService.exception('[FeedService]', err);
      }

      if (!await this.fetchLocal()) {
        // if there is no local data rethrow the exception
        throw err;
      }

      showMessage({
        floating: true,
        position: 'top',
        message: (connectivityService.isConnected ? i18n.t('cantReachServer') : i18n.t('noInternet')),
        description: i18n.t('showingStored'),
        duration: 1300,
        backgroundColor: '#FFDD63DD',
        color: Colors.dark,
        type: "info",
      });
    }
  }

  /**
   * Move offset to next page
   */
  next(): FeedsService  {
    this.offset += this.limit;
    return this;
  }

  /**
   * Clear the store
   */
  clear(): FeedsService {
    this.offset = 0;
    this.limit = 12;
    this.pagingToken = '';
    this.params =  {sync: 1};
    this.feed = [];
    return this;
  }
}
