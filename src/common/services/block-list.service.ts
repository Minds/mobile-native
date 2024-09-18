import { observable, action } from 'mobx';
import type { ApiService } from './api.service';
import type { Storages } from './storage/storages.service';
import type { SessionService } from './session.service';
import { LogService } from './log.service';

const key = 'blockedChannels';

/**
 * Block list service
 */
export class BlockListService {
  constructor(
    private apiService: ApiService,
    private storagesService: Storages,
    private logService: LogService,
    private sessionService: SessionService,
  ) {}

  @observable blocked: Map<string, undefined> = new Map();

  init() {
    this.sessionService.onSession(async token => {
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
    const guids = this.storagesService.user?.getObject<Array<string>>(key);
    if (guids) {
      guids.forEach(g => this.blocked.set(g, undefined));
    }
  }

  async fetch() {
    try {
      const response = await this.apiService.get<any>('api/v1/block', {
        sync: 1,
        limit: 10000,
      });

      if (response.guids) {
        this.blocked.clear();
        response.guids.forEach(g => this.blocked.set(g, undefined));
      }

      this.storagesService.user?.setObject<Array<string>>(key, response.guids); // save to storage
    } catch (err) {
      this.logService.exception('[BlockListService]', err);
    }
  }

  prune() {
    this.blocked.clear();
    this.storagesService.user?.setObject(key, []);
  }

  getList() {
    return this.blocked;
  }

  @action
  add(guid: string) {
    this.blocked.set(guid, undefined);
    this.storagesService.user?.setObject<Array<string>>(
      key,
      Array.from(this.blocked.keys()),
    );
  }

  @action
  remove(guid: string) {
    this.blocked.delete(guid);
    this.storagesService.user?.setObject<Array<string>>(
      key,
      Array.from(this.blocked.keys()),
    );
  }
}
