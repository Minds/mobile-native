import {
  observable,
  action,
  computed,
  extendObservable
} from 'mobx';

import discoveryService from './DiscoveryService';
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
    this.buildListStores();
    this.listenChanges();
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
   * Build lists stores
   */
  buildListStores() {

    this.filters = new NewsfeedFilterStore('hot', 'images', '12h', []);

    this.listStore.setLimit(12);

    this.listStore.getMetadataService()
      .setSource('feed/discovery')
      .setMedium('feed');

    // this.stores.activities.list.getMetadataService()
    //   .setSource('feed/discovery')
    //   .setMedium('feed');

    // this.stores.blogs.list.getMetadataService()
    //   .setSource('feed/discovery')
    //   .setMedium('feed');

    // this.stores.channels.list.getMetadataService()
    //   .setSource('feed/discovery')
    //   .setMedium('feed');
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
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
    });
  }

  /**
   * Refresh list
   */
  @action
  async refresh() {
    //can we refresh
    if (this.list.refreshing || this.loading) {
      return;
    }
    // NOTE: we do not rely on this.list because it could change during the await
    const store = this.stores[this.filters.type];

    await store.list.refresh();
    await this.loadList(true);
    store.list.refreshDone();
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
    store.listStore.clear();
    this.fetch();
  }

  fetch() {
    const hashtags = appStores.hashtag.hashtag ? encodeURIComponent(appStores.hashtag.hashtag) : '';
    const all = appStores.hashtag.all ? '1' : '';

    this.listStore
      .setEndpoint(`api/v2/feeds/global/${this.filters.filter}/${this.filters.type}`)
      .setParams({
        hashtags,
        period: this.filters.period,
        all,
        query: this.filters.searchtext,
        nsfw: this.filters.nsfw.concat([]),
      })
      .fetch();
  }

  /**
   * Reload tje list
   */
  @action
  reload() {
    this.list.clearList();
    this.loadList(true);
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
