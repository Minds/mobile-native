import { action, observable } from 'mobx';

import FeedStore from '../../../common/stores/FeedStore';

/**
 * Discovery Search Store
 */
export default class DiscoveryV2SearchStore {
  listStore = new FeedStore(true);

  @observable algorithm: string = 'top';
  @observable query: string = '';
  @observable refreshing: boolean = false;
  @observable filter: string = 'all';

  params = {
    period: 'relevant',
    algorithm: this.algorithm,
    q: this.query,
    plus: false,
    type: this.filter,
  };

  constructor() {
    this.listStore
      .setEndpoint('api/v3/discovery/search')
      .setLimit(12)
      .setInjectBoost(false)
      .setAsActivities(false)
      .setPaginated(true)
      .setParams(this.params);
  }

  @action
  setQuery = (query: string, plus: boolean | undefined) => {
    this.query = query;
    this.params.q = query;
    this.params.plus = !!plus;
    this.listStore.clear();
    this.refresh();
  };

  @action
  fetch = (refresh = false): void => {
    this.listStore
      .setParams({
        period: 'relevant',
        algorithm: this.algorithm,
        q: this.query,
        // nsfw: this.filters.nsfw.concat([]),
      })
      .fetch();
  };

  @action
  setAlgorithm = (algorithm: string) => {
    this.algorithm = algorithm;
    this.params.algorithm = algorithm;
    this.listStore.clear();
    this.refresh();
  };

  @action
  setFilter = (filter: string) => {
    this.filter = filter;
    this.params.type = filter;
    this.listStore.clear();
    this.refresh();
  };

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
