import { action, observable } from 'mobx';
import debounce from 'lodash/debounce';
import { storages } from '~/common/services/storage/storages.service';

import FeedStore from '../../../common/stores/FeedStore';

export type DiscoveryV2SearchStoreAlgorithm =
  | 'top'
  | 'latest'
  | 'channels'
  | 'groups';

/**
 * Discovery Search Store
 */
export default class DiscoveryV2SearchStore {
  listStore = new FeedStore(true);

  @observable algorithm: DiscoveryV2SearchStoreAlgorithm = 'top';
  @observable query: string = '';
  @observable refreshing: boolean = false;
  @observable filter: string = 'all';
  @observable nsfw: Array<number> = [];
  refresh: any;

  params = {
    period: 'relevant',
    algorithm: this.algorithm,
    q: this.query,
    plus: false,
    type: this.filter,
    nsfw: [] as Array<number>,
  };

  constructor() {
    this.listStore.getMetadataService()?.setSource(`search/${this.algorithm}`);
    this.params.nsfw = storages.user?.getArray('discovery-nsfw') || [];
    this.nsfw = this.params.nsfw;
    this.listStore
      .setEndpoint('api/v3/discovery/search')
      .setLimit(12)
      .setInjectBoost(false)
      .setAsActivities(false)
      .setPaginated(true)
      .setParams(this.params);

    this.refresh = debounce(this._refresh, 300);
  }

  @action
  setQuery = (query: string, plus: boolean | undefined) => {
    this.query = query;
    this.params.q = query;
    this.params.plus = !!plus;
    this.refresh();
  };

  @action
  fetch = (): void => {
    this.listStore
      .setParams({
        period: 'relevant',
        algorithm: this.algorithm,
        q: this.query,
        nsfw: this.nsfw,
      })
      .fetch();
  };

  @action
  setAlgorithm = (algorithm: DiscoveryV2SearchStoreAlgorithm) => {
    this.listStore.getMetadataService()?.setSource(`search/${algorithm}`);
    this.algorithm = algorithm;
    this.params.algorithm = algorithm;
    this.refresh();
  };

  @action
  setFilter = (filter: string) => {
    this.filter = filter;
    this.params.type = filter;
    this.refresh();
  };

  @action
  setNsfw = (nsfw: Array<number>) => {
    storages.user?.setArray('discovery-nsfw', nsfw);
    this.nsfw = nsfw;
    this.params.nsfw = nsfw;
    this.refresh();
  };

  @action
  async _refresh(): Promise<void> {
    this.refreshing = true;
    this.listStore.clear();
    await this.listStore.setParams(this.params).refresh();
    this.refreshing = false;
  }

  @action
  reset() {
    this.query = '';
    this.listStore.clear();
  }
}
