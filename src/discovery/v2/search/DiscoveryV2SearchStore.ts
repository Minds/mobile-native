import { action, observable } from 'mobx';

import FeedStore from '../../../common/stores/FeedStore';

/**
 * Discovery Search Store
 */
export default class DiscoveryV2SearchStore {
  @observable listStore = new FeedStore(true);

  @observable query: string = '';
  @observable refreshing: boolean = false;

  constructor() {
    this.listStore
      .setEndpoint(`api/v2/feeds/global/latest/activities`)
      .setLimit(12)
      .setInjectBoost(false)
      .setAsActivities(false)
      .setPaginated(false) // TODO: why is this creating duplicates
      .setParams({
        // hashtags,
        period: '1y',
        all: 1,
        query: this.query,
        // nsfw: this.filters.nsfw.concat([]),
        period_fallback: 1,
      });
  }

  @action
  setQuery = (query: string) => {
    this.query = query;
    this.listStore.clear();
    this.refresh();
  };

  @action
  fetch = (refresh = false): void => {
    this.listStore
      .setEndpoint(`api/v2/feeds/global/latest/activities`)
      .setLimit(12)
      .setInjectBoost(false)
      .setAsActivities(false)
      .setPaginated(false) // TODO: why is this creating duplicates
      .setParams({
        // hashtags,
        period: '1y',
        all: 1,
        query: this.query,
        // nsfw: this.filters.nsfw.concat([]),
        period_fallback: 1,
      })
      .fetch();
  };

  @action
  async refresh(): Promise<void> {
    this.refreshing = true;
    await this.listStore.refresh();
    this.refreshing = false;
  }

  @action
  reset() {
    this.query = '';
    this.listStore.clear();
  }
}
