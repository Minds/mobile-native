import { observable, action } from 'mobx';
import apiService from '../../common/services/api.service';
import { useLegacyStores } from '../../common/hooks/use-stores';

export type TDiscoveryV2Tabs = 'foryou' | 'tags' | 'boosts';

export default class DiscoveryV2Store {
  @observable activeTabId: TDiscoveryV2Tabs = 'foryou';
  @observable trends = [];
  @observable tags = [];
  @observable trendingTags = [];
  @observable loading = false;
  @observable refreshing = false;

  @action
  setTabId(id: TDiscoveryV2Tabs) {
    switch (id) {
      case 'foryou':
        if (id === this.activeTabId) {
          // already on tab
          this.refreshTrends();
        }
        break;
      case 'tags':
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
  async loadTrends(refresh: boolean = false): Promise<void> {
    this.loading = true;
    try {
      const response: any = await apiService.get('api/v3/discovery/trends');
      this.setTrends([
        response.hero,
        ...response.trends.filter((trend) => !!trend),
      ]);
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
  async loadTags(refresh: boolean = false): Promise<void> {
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
    await this.loadTrends(true);
    this.refreshing = false;
  }

  @action
  async refreshTags(): Promise<void> {
    this.refreshing = true;
    this.setTags([]);
    this.setTrendingTags([]);
    await this.loadTags(true);
    this.refreshing = false;
  }

  @action
  reset() {
    this.trends = [];
    this.activeTabId = 'foryou';
    this.refreshing = false;
  }
}
