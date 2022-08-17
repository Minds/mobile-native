import { observable, action } from 'mobx';
import apiService from '../../common/services/api.service';
import FeedStore from '../../common/stores/FeedStore';

export type TDiscoveryV2Tabs =
  | 'top'
  | 'foryou'
  | 'your-tags'
  | 'trending-tags'
  | 'boosts';

const tabIndex: Record<TDiscoveryV2Tabs, number> = {
  top: 0,
  foryou: 1,
  'your-tags': 2,
  'trending-tags': 3,
  boosts: 4,
};

export type TDiscoveryTrendsTrend = {};

export type TDiscoveryTagsTag = {
  value: string;
};

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
  boostFeed: FeedStore;
  trendingFeed: FeedStore;
  allFeed: FeedStore;
  topFeed: FeedStore;

  constructor(plus: boolean = false) {
    this.boostFeed = new FeedStore(true);
    this.boostFeed
      .getMetadataService()!
      .setSource('feed/boosts')
      .setMedium('featured-content');

    this.boostFeed
      .setEndpoint('api/v2/boost/feed')
      .setInjectBoost(false)
      .setLimit(15);

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

    this.topFeed = new FeedStore(true);
    this.topFeed
      .setEndpoint('api/v3/newsfeed/feed/clustered-recommendations')
      .setParams({ unseen: true })
      .setInjectBoost(false)
      .setLimit(15);

    if (plus) {
      this.activeTabId = 'foryou';
    }
  }

  @action
  setTabId(id: TDiscoveryV2Tabs) {
    // set animation direction based on current and target tabs
    this.direction = tabIndex[id] > tabIndex[this.activeTabId] ? 1 : 0;
    if (tabIndex)
      switch (id) {
        case 'top':
          this.topFeed.fetchRemoteOrLocal();
          break;
        case 'boosts':
          this.boostFeed.fetchRemoteOrLocal();
          break;
        case 'trending-tags':
          this.trendingFeed.fetchRemoteOrLocal();
          break;
        case 'foryou':
          if (id === this.activeTabId) {
            // already on tab
            this.refreshTrends();
          }
          break;
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
    if (clean) this.setTrends([]);
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
      case 'foryou':
        this.refreshTrends();
        return this.allFeed.refresh();
      case 'your-tags':
        return this.refreshTags();
      case 'trending-tags':
        this.refreshTags();
        return this.trendingFeed.clear().refresh();
      case 'boosts':
        return this.boostFeed.refresh();
    }
  }

  @action
  reset() {
    this.allFeed.reset();
    this.topFeed.reset();
    this.trendingFeed.reset();
    this.boostFeed.reset();
    this.trends = [];
    this.tags = [];
    this.trendingTags = [];
    this.activeTabId = 'foryou';
    this.refreshing = false;
    this.loading = false;
  }
}
