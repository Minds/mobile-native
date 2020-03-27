import {action, observable} from 'mobx';

import NewsfeedFilterStore from '../common/stores/NewsfeedFilterStore';
import DiscoveryFeedStore from './DiscoveryFeedStore';

import FeedStore from '../common/stores/FeedStore';
import { getStores } from '../../AppStores';

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

  @observable query = ''

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

    this.listStore
      .setInjectBoost(false)
      .setPaginated(false)
      .getMetadataService()
        .setSource('feed/discovery')
        .setMedium('feed');
  }

  /**
   * On filter changes
   * @param {string} filter
   * @param {string} type
   * @param {string} period
   * @param {string} searchtext
   */
  onFilterChange = (filter, type, period, nsfw) => {
    this.listStore.feedsService.abort();
    this.listStore.clear();

    if (this.filters.type !== 'lastchannels') {
      this.fetch();
    }
  };

  /**
   * On search change
   */
  onSearchChange = (searchtext) => {
    this.fetch(true);
  };

  fetch(refresh = false) {
    const hashtags = getStores().hashtag.hashtag ? encodeURIComponent(getStores().hashtag.hashtag) : '';
    const all = getStores().hashtag.all ? '1' : '';

    this.listStore
      .setEndpoint(`api/v2/feeds/global/${this.filters.filter}/${this.filters.type}`)
      .setLimit((this.filters.type === 'images' || this.filters.type === 'videos') ? 24 : 12)
      .setInjectBoost(this.filters.type === 'activities')
      .setAsActivities(this.filters.type !== 'blogs')
      .setParams({
        hashtags,
        period: this.filters.period,
        all,
        query: this.filters.searchtext,
        nsfw: this.filters.nsfw.concat([]),
        period_fallback: 1,
      })
      .fetchRemoteOrLocal(refresh);
  }

  /**
   * Reload tje list
   */
  @action
  reload() {
    // ignore reload for latest channels
    if (this.filters.type === 'lastchannels') {
      return;
    }
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

    this.feedStore.reset();
    this.listStore.clear();

    if (this.filters) {
      this.filters.clear();
      this.listenChanges();
    }
  }

  @action
  setQuery(value) {
    this.query = value;
  }
}

export default DiscoveryStore;
