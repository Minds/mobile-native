import { action, observable } from 'mobx';

import FeedStore from '../../../common/stores/FeedStore';

/**
 * Discovery Search Store
 */
export default class DiscoveryV2SearchStore {
  @observable listStore = new FeedStore(true);

  @observable filter: string = 'top';
  @observable query: string = '';
  @observable refreshing: boolean = false;

  params = {
    period: 'relevant',
    algorithm: this.filter,
    q: this.query,
  };

  constructor() {
    this.listStore
      .setEndpoint(`api/v3/discovery/search`)
      .setLimit(12)
      .setInjectBoost(false)
      .setAsActivities(false)
      .setPaginated(false)
      .setParams(this.params);
  }

  @action
  setQuery = (query: string) => {
    this.query = query;
    this.params.q = query;
    this.listStore.clear();
    this.refresh();
  };

  @action
  fetch = (refresh = false): void => {
    this.listStore
      .setParams({
        period: 'relevant',
        algorithm: this.filter,
        q: this.query,
        // nsfw: this.filters.nsfw.concat([]),
      })
      .fetch();
  };

  @action
  setFilter(filter: string) {
    this.filter = filter;
    this.params.algorithm = filter;
    this.listStore.clear();
    this.refresh();
  }

  @action
  async refresh(): Promise<void> {
    this.refreshing = true;
    await this.listStore.setParams(this.params).refresh();
    this.refreshing = false;
  }

  @action
  reset() {
    this.query = '';
    this.listStore.clear();
  }
}
