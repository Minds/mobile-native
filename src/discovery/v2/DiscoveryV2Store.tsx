import { observable, action } from 'mobx';
import apiService from '~/common/services/api.service';
import FeedStore from '~/common/stores/FeedStore';
import { storages } from '~/common/services/storage/storages.service';
import { hasVariation } from '../../../ExperimentsProvider';

export default class DiscoveryV2Store {
  @observable activeTabId: TDiscoveryV2Tabs = 'latest';
  @observable trends: TDiscoveryTrendsTrend[] = [];
  @observable tags: TDiscoveryTagsTag[] = [];
  @observable trendingTags: TDiscoveryTagsTag[] = [];
  /**
   * trends loading state
   */
  @observable loading = false;
  /**
   * Tab animation direction
   */
  @observable direction = -1;
  @observable loadingTags = false;
  @observable refreshing = false;
  @observable badgeVisible = true;
  trendingFeed: FeedStore;
  allFeed: FeedStore;
  topFeed: FeedStore;
  latestFeed: FeedStore;
  supermindsFeed: FeedStore;
  lastDiscoveryTimestamp = 0;
  plus?: boolean;

  constructor(plus: boolean = false) {
    this.plus = plus;
    this.trendingFeed = new FeedStore(true)
      .setEndpoint('api/v2/feeds/global/top/all')
      .setParams({ period: '12h', plus })
      .setInjectBoost(false)
      .setLimit(15);

    this.allFeed = new FeedStore(true);
    this.allFeed
      .getMetadataService()!
      .setSource('feed/discovery')
      .setMedium('feed');

    this.allFeed
      .setEndpoint('api/v2/feeds/global/topV2/all')
      .setInjectBoost(false)
      .setLimit(15);

    this.latestFeed = new FeedStore(true);
    this.latestFeed
      .setEndpoint('api/v3/discovery/search?q=&f=latest&t=all')
      .fetchRemoteOrLocal();

    this.topFeed = new FeedStore(true);
    this.topFeed
      .setEndpoint('api/v3/newsfeed/feed/clustered-recommendations')
      .setParams({ unseen: true })
      .setInjectBoost(false)
      .setLimit(15);

    if (plus) {
      this.activeTabId = 'foryou';
    }

    this.supermindsFeed = new FeedStore()
      .setEndpoint('api/v3/newsfeed/superminds')
      .setInjectBoost(false)
      .setLimit(15);

    this.lastDiscoveryTimestamp = storages.app.getInt(DISCOVERY_TS_KEY) ?? 0;

    this.badgeVisible =
      +new Date() - (this.lastDiscoveryTimestamp ?? 0) > 86400 * 1000; // 24 hours
  }

  @action
  setTabId(id: TDiscoveryV2Tabs) {
    // set animation direction based on current and target tabs
    this.direction = tabIndex[id] > tabIndex[this.activeTabId] ? 1 : 0;
    if (tabIndex) {
      switch (id) {
        case 'latest':
          this.latestFeed.fetchRemoteOrLocal();
          break;
        case 'top':
          this.topFeed.fetchRemoteOrLocal();
          break;
        case 'trending-tags':
          this.trendingFeed.fetchRemoteOrLocal();
          break;
        case 'supermind':
          this.supermindsFeed.fetchRemoteOrLocal();
          break;
        case 'foryou':
          if (id === this.activeTabId) {
            // already on tab
            this.refreshTrends();
          }
          break;
      }
    }

    this.activeTabId = id;
  }

  /**
   * Load discovery overview
   */
  @action
  async loadTrends(plus?: boolean): Promise<void> {
    this.loading = true;

    try {
      const params = plus
        ? { plus: 1, as_activities: 1 }
        : { as_activities: 1 };
      const response = await apiService.get<any>(
        'api/v3/discovery/trends',
        params,
      );
      const trends = response.trends.filter(trend => !!trend);
      if (response.hero) {
        trends.unshift(response.hero);
      }
      this.setTrends(trends);
      //this.setHero(response.hero);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load discovery overview
   */
  @action
  async loadTags(plus?: boolean): Promise<void> {
    this.loadingTags = true;
    try {
      const params = plus
        ? { plus: 1, as_activities: 1 }
        : { as_activities: 1 };
      const response = await apiService.get<any>(
        'api/v3/discovery/tags',
        params,
      );
      this.setTags(response.tags);
      this.setTrendingTags(response.trending);
    } catch (err) {
      console.log(err);
    } finally {
      this.loadingTags = false;
    }
  }

  @action
  setTrends(trends): void {
    this.trends = trends.slice();
  }

  @action
  setTags(tags): void {
    this.tags = tags.slice();
  }

  @action
  setTrendingTags(tags): void {
    this.trendingTags = tags.slice();
  }

  @action
  async refreshTrends(
    plus: boolean | undefined = undefined,
    clean = true,
  ): Promise<void> {
    this.refreshing = true;
    if (clean) {
      this.setTrends([]);
    }
    await this.loadTrends(plus);
    this.refreshing = false;
  }

  @action
  async refreshTags(): Promise<void> {
    this.refreshing = true;
    await this.loadTags();
    this.refreshing = false;
  }

  @action
  async saveTags(
    selected: TDiscoveryTagsTag[],
    deselected: TDiscoveryTagsTag[],
  ): Promise<void> {
    this.tags = selected.slice();
    await apiService.post('api/v3/discovery/tags', {
      selected: selected.map(tag => tag.value),
      deselected: deselected.map(tag => tag.value),
    });

    // this.refreshTrends();
    this.refreshTags(); // Sometimes the server gets behind
  }

  @action
  refreshActiveTab() {
    switch (this.activeTabId) {
      case 'latest':
        return this.latestFeed.refresh();
      case 'top':
        return this.topFeed.refresh();
      case 'foryou':
        this.refreshTrends();
        return this.allFeed.refresh();
      case 'your-tags':
        return this.refreshTags();
      case 'trending-tags':
        this.refreshTags();
        return this.trendingFeed.clear().refresh();
    }
  }

  @action
  reset() {
    this.allFeed.reset();
    this.topFeed.reset();
    this.trendingFeed.reset();
    this.trends = [];
    this.tags = [];
    this.trendingTags = [];
    this.activeTabId = hasVariation('mob-5038-discovery-consolidation')
      ? this.plus
        ? 'foryou'
        : 'latest'
      : 'foryou';
    this.refreshing = false;
    this.loading = false;
    this.showBadge();
  }

  clearBadge() {
    this.badgeVisible = false;
    this.lastDiscoveryTimestamp = +new Date();
    storages.app.setInt(DISCOVERY_TS_KEY, this.lastDiscoveryTimestamp);
  }

  showBadge() {
    this.badgeVisible = true;
    this.lastDiscoveryTimestamp = 0;
    storages.app.setInt(DISCOVERY_TS_KEY, this.lastDiscoveryTimestamp);
  }
}

export type TDiscoveryV2Tabs =
  | 'latest'
  | 'top'
  | 'foryou'
  | 'your-tags'
  | 'trending-tags'
  | 'boosts'
  | 'supermind'
  | 'channels'
  | 'groups';

const tabIndex: Record<TDiscoveryV2Tabs, number> = {
  latest: 0,
  top: 1,
  foryou: 2,
  'your-tags': 3,
  'trending-tags': 4,
  boosts: 5,
  supermind: 6,
  channels: 7,
  groups: 8,
};

export type TDiscoveryTrendsTrend = {};

export type TDiscoveryTagsTag = {
  value: string;
};

const DISCOVERY_TS_KEY = 'discovery_ts';
