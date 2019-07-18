import {
  observable,
  action,
  computed,
  extendObservable
} from 'mobx';

import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import UserModel from '../channel/UserModel';
import GroupModel from '../groups/GroupModel';
import NewsfeedFilterStore from '../common/stores/NewsfeedFilterStore';
import DiscoveryFeedStore from './DiscoveryFeedStore';
import logService from '../common/services/log.service';
import featuresService from '../common/services/features.service';
import boostedContentService from '../common/services/boosted-content.service';
import FeedStore from '../common/stores/FeedStore';
import appStores from '../../AppStores';

/**
 * Discovery Store
 */
class DiscoveryStore {

  /**
   * FeedStore
   */
  feedStore;

  /**
   * Lists store
   */
  listStore = new FeedStore(true);

  /**
   * Filter change reaction disposer
   */
  onFilterChangeDisposer;

  /**
   * Search change reaction disposer
   */
  onSearchChangeDisposer;

  constructor() {
    this.feedStore = new DiscoveryFeedStore(this.filters);
  }

  /**
   * Listen for filter changes
   */
  listenChanges() {
    // react to filter changes
    this.onFilterChangeDisposer = this.filters.onFilterChange(this.onFilterChange);
    // react to search changes
    this.onSearchChangeDisposer = this.filters.onSearchChange(this.onSearchChange);
  }

  /**
   * init
   */
  init() {
    // We instantiate the store later because it needs the settingsStore loaded first
    this.filters = new NewsfeedFilterStore('hot', 'images', '12h', []);

    this.listenChanges();

    this.listStore.getMetadataService()
      .setSource('feed/discovery')
      .setMedium('feed');
  }

  /**
   * Inject boosts to the feed
   * @param {object} feed
   * @param {OffsetFeedListStore} list
   */
  async injectBoosts(feed, list) {
    const start = list.entities.length;
    const finish = feed.entities.length + start;

    if (finish > 40) return;

    await this.insertBoost(3, feed, start, finish);
    await this.insertBoost(8, feed, start, finish);
    await this.insertBoost(16, feed, start, finish);
    await this.insertBoost(24, feed, start, finish);
    await this.insertBoost(32, feed, start, finish);
    await this.insertBoost(40, feed, start, finish);
  }

  /**
   * Insert a boost in give position
   * @param {integer} position
   * @param {object} feed
   * @param {integer} start
   * @param {integer} finish
   */
  async insertBoost(position, feed, start, finish) {
    if (start <= position && finish >= position) {
      try {
        const boost = await boostedContentService.fetch();
        if (boost) feed.entities.splice( position + start, 0, boost );
      } catch (err) {
        logService.exception('[DiscoveryStore] insertBoost', err);
      }
    }
  }

  /**
   * On filter changes
   * @param {string} filter
   * @param {string} type
   * @param {string} period
   * @param {string} searchtext
   */
  onFilterChange = (filter, type, period, nsfw) => {
    this.listStore.clear();
    this.fetch();
  }

  /**
   * On search change
   */
  onSearchChange = (searchtext) => {
    this.fetch(true);
  }

  fetch(refresh = false) {
    const hashtags = appStores.hashtag.hashtag ? encodeURIComponent(appStores.hashtag.hashtag) : '';
    const all = appStores.hashtag.all ? '1' : '';

    this.listStore
      .setEndpoint(`api/v2/feeds/global/${this.filters.filter}/${this.filters.type}`)
      .setLimit((this.filters.type === 'images' || this.filters.type === 'videos') ? 24 : 12)
      .setAsActivities(this.filters.type !== 'blogs')
      .setParams({
        hashtags,
        period: this.filters.period,
        all,
        query: this.filters.searchtext,
        nsfw: this.filters.nsfw.concat([]),
      })
      .fetchRemoteOrLocal(refresh);
  }

  /**
   * Reload tje list
   */
  @action
  reload() {
    this.listStore.clear();
    this.fetch();
  }

  @action
  clearList() {
    this.filters.type = 'images';
    this.filters.filter = 'hot';
  }

  @action
  reset() {
    this.onFilterChangeDisposer && this.onFilterChangeDisposer();
    this.onSearchChangeDisposer && this.onSearchChangeDisposer();
    this.filters.clear();
    this.feedStore.reset();
    this.listStore.clear();
    this.listenChanges();
  }
}

export default DiscoveryStore;
