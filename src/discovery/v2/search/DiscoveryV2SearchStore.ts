import { action, observable } from 'mobx';
import { storages } from '~/common/services/storage/storages.service';
import MetadataService from '~/common/services/metadata.service';
import FeedStore from '../../../common/stores/FeedStore';

/**
 * Discovery Search Store
 */
export default class DiscoveryV2SearchStore {
  listStore = new FeedStore();

  @observable algorithm: string = 'top';
  @observable query: string = '';
  @observable refreshing: boolean = false;
  @observable filter: string = 'all';
  @observable nsfw: Array<number> = [];

  params = {
    period: 'relevant',
    algorithm: this.algorithm,
    q: this.query,
    plus: false,
    type: this.filter,
    nsfw: [] as Array<number>,
  };

  constructor() {
    this.listStore.setMetadata(
      new MetadataService().setSource(`search/${this.algorithm}`),
    );
    this.params.nsfw = storages.user?.getArray('discovery-nsfw') || [];
    this.nsfw = this.params.nsfw;
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
        nsfw: this.nsfw,
      })
      .fetch();
  };

  @action
  setAlgorithm = (algorithm: string) => {
    this.listStore.getMetadataService()?.setSource(`search/${algorithm}`);
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
  setNsfw = (nsfw: Array<number>) => {
    storages.user?.setArray('discovery-nsfw', nsfw);
    this.nsfw = nsfw;
    this.params.nsfw = nsfw;
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
