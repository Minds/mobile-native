import { observable, action } from 'mobx';
import apiService from '~/common/services/api.service';
import FeedStore from '~/common/stores/FeedStore';
import { storages } from '~/common/services/storage/storages.service';

export default class DiscoveryV2Store {
  @observable activeTabId: TDiscoveryV2Tabs = 'top';
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
  topFeed: FeedStore;
  lastDiscoveryTimestamp = 0;

  constructor(plus: boolean = false) {
    this.trendingFeed = new FeedStore(true)
      .setEndpoint('api/v2/feeds/global/top/all')
      .setParams({ period: '12h', plus })
      .setInjectBoost(false)
      .setLimit(15);

    this.topFeed = new FeedStore(true);
    this.topFeed
      .setEndpoint('api/v3/newsfeed/feed/clustered-recommendations')
      .setParams({ unseen: true })
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
        case 'top':
          this.topFeed.fetchRemoteOrLocal();
          break;
        case 'trending-tags':
          this.trendingFeed.fetchRemoteOrLocal();
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
      case 'top':
        return this.topFeed.refresh();
      case 'trending-tags':
        this.refreshTags();
        return this.trendingFeed.clear().refresh();
    }
  }

  @action
  reset() {
    this.topFeed.reset();
    this.trendingFeed.reset();
    this.trends = [];
    this.tags = [];
    this.trendingTags = [];
    this.activeTabId = 'top';
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
  | 'top'
  | 'foryou'
  | 'your-tags'
  | 'trending-tags'
  | 'boosts'
  | 'supermind'
  | 'channels'
  | 'groups';

const tabIndex: Record<TDiscoveryV2Tabs, number> = {
  top: 0,
  foryou: 1,
  'your-tags': 2,
  'trending-tags': 3,
  boosts: 4,
  supermind: 5,
  channels: 6,
  groups: 7,
};

export type TDiscoveryTrendsTrend = {};

export type TDiscoveryTagsTag = {
  value: string;
};

const DISCOVERY_TS_KEY = 'discovery_ts';

// TODO: workaround please remove
const BOOST_V3 = true;
