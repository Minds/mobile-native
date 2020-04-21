import { observable, action } from 'mobx';
import apiService from '../../common/services/api.service';

export default class DiscoveryV2Store {
  @observable activeTabId = 'foryou';
  @observable trends = [];
  @observable loading = false;
  @observable refreshing = false;

  @action
  setTabId(id) {
    this.activeTabId = id;
  }

  /**
   * Load discovery overview
   */
  @action
  async loadTrends(refresh: boolean = false): Promise<void> {
    this.setLoading(true);
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
      this.setLoading(false);
    }
  }

  @action
  setTrends(trends): void {
    this.trends = trends.slice();
  }

  @action
  setLoading(loading): void {
    this.loading = loading;
  }

  @action
  async refreshTrends(): Promise<void> {
    this.refreshing = true;
    //this.setTrends([]);
    await this.loadTrends(true);
    this.refreshing = false;
  }

  @action
  reset() {
    this.trends = [];
    this.activeTabId = 'foryou';
    this.refreshing = false;
  }
}
