import apiService from './api.service';
import { sessionService } from '~/common/services';
import logService from './log.service';
import { observable, action } from 'mobx';
import { storagesService } from '~/common/services';
import { BLOCK_USER_ENABLED } from '~/config/Config';

const key = 'blockedChannels';

/**
 * Block list service
 */
export class BlockListService {
  @observable blocked: Map<string, undefined> = new Map();

  init() {
    if (BLOCK_USER_ENABLED) {
      sessionService.onSession(async token => {
        if (token) {
          await this.loadFromStorage();
          this.fetch();
        } else {
          this.prune();
        }
      });
    }
  }

  has(guid) {
    return this.blocked.has(guid);
  }

  loadFromStorage() {
    const guids = storagesService.user?.getObject<Array<string>>(key);
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

      storagesService.user?.setObject<Array<string>>(key, response.guids); // save to storage
    } catch (err) {
      logService.exception('[BlockListService]', err);
    }
  }

  prune() {
    this.blocked.clear();
    storagesService.user?.setObject(key, []);
  }

  getList() {
    return this.blocked;
  }

  @action
  add(guid: string) {
    this.blocked.set(guid, undefined);
    storagesService.user?.setObject<Array<string>>(
      key,
      Array.from(this.blocked.keys()),
    );
  }

  @action
  remove(guid: string) {
    this.blocked.delete(guid);
    storagesService.user?.setObject<Array<string>>(
      key,
      Array.from(this.blocked.keys()),
    );
  }
}

export default new BlockListService();
