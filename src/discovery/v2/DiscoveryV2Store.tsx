import { observable, action } from 'mobx';
import apiService from '../../common/services/api.service';
import FeedStore from '../../common/stores/FeedStore';

export type TDiscoveryV2Tabs =
  | 'foryou'
  | 'your-tags'
  | 'trending-tags'
  | 'boosts';

export type TDiscoveryTrendsTrend = {};

export type TDiscoveryTagsTag = {
  value: string;
};

export default class DiscoveryV2Store {
  @observable activeTabId: TDiscoveryV2Tabs = 'foryou';
  @observable trends: TDiscoveryTrendsTrend[] = [];
  @observable tags: TDiscoveryTagsTag[] = [];
  @observable trendingTags: TDiscoveryTagsTag[] = [];
  @observable loading = false;
  @observable refreshing = false;
  boostFeed: FeedStore;

  constructor() {
    this.boostFeed = new FeedStore(true);
    this.boostFeed
      .getMetadataService()!
      .setSource('feed/boosts')
      .setMedium('featured-content');

    this.boostFeed
      .setEndpoint('api/v2/boost/feed')
      .setInjectBoost(false)
      .setLimit(15);
  }

  @action
  setTabId(id: TDiscoveryV2Tabs) {
    switch (id) {
      case 'foryou':
        if (id === this.activeTabId) {
          // already on tab
          this.refreshTrends();
        }
        break;
      case 'trending-tags':
        break;
      case 'boosts':
        break;
    }
    this.activeTabId = id;
  }

  /**
   * Load discovery overview
   */
  @action
  async loadTrends(): Promise<void> {
    this.loading = true;
    try {
      const response: any = await apiService.get('api/v3/discovery/trends');
      const trends = response.trends.filter((trend) => !!trend);
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
  async loadTags(): Promise<void> {
    this.loading = true;
    try {
      const response: any = await apiService.get('api/v3/discovery/tags');
      this.setTags(response.tags);
      this.setTrendingTags(response.trending);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
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
  async refreshTrends(): Promise<void> {
    this.refreshing = true;
    this.setTrends([]);
    await this.loadTrends();
    this.refreshing = false;
  }

  @action
  async refreshTags(): Promise<void> {
    this.refreshing = true;
    this.setTags([]);
    this.setTrendingTags([]);
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
      selected: selected.map((tag) => tag.value),
      deselected: deselected.map((tag) => tag.value),
    });

    // this.refreshTrends();
    this.refreshTags(); // Sometimes the server gets behind
  }

  @action
  reset() {
    this.trends = [];
    this.activeTabId = 'foryou';
    this.refreshing = false;
  }
}
