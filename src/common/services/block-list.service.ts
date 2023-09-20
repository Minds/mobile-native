import apiService from './api.service';
import sessionService from './session.service';
import logService from './log.service';
import { observable, action } from 'mobx';
import { storages } from './storage/storages.service';

const key = 'blockedChannels';

/**
 * Block list service
 */
export class BlockListService {
  @observable blocked: Map<string, undefined> = new Map();

  init() {
    sessionService.onSession(async token => {
      if (token) {
        await this.loadFromStorage();
        this.fetch();
      } else {
        this.prune();
      }
    });
  }

  has(guid) {
    return this.blocked.has(guid);
  }

  loadFromStorage() {
    const guids = storages.user?.getArray<string>(key);
    if (guids) {
      guids.forEach(g => this.blocked.set(g, undefined));
    }
  }

  async fetch() {
    try {
      const response = await apiService.get<any>('api/v1/block', {
        sync: 1,
        limit: 10000,
      });

      if (response.guids) {
        this.blocked.clear();
        response.guids.forEach(g => this.blocked.set(g, undefined));
      }

      storages.user?.setArray(key, response.guids); // save to storage
    } catch (err) {
      logService.exception('[BlockListService]', err);
    }
  }

  prune() {
    this.blocked.clear();
    storages.user?.setArray(key, []);
  }

  getList() {
    return this.blocked;
  }

  @action
  add(guid: string) {
    this.blocked.set(guid, undefined);
    storages.user?.setArray(key, Array.from(this.blocked.keys()));
  }

  @action
  remove(guid: string) {
    this.blocked.delete(guid);
    storages.user?.setArray(key, Array.from(this.blocked.keys()));
  }
}

export default new BlockListService();
