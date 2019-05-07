import BlockListSync from "../../lib/minds-sync/services/BlockListSync";
import apiService from "./api.service";
import sqliteStorageProviderService from "./sqlite-storage-provider.service";
import sessionService from "./session.service";
import { EventEmitter } from "events";

class BlockListService {
  constructor() {
    const storageAdapter = sqliteStorageProviderService.get();
    this.sync = new BlockListSync(apiService, storageAdapter);

    this.sync.setUp();

    sessionService.onSession(token => {
      if (token) {
        this.doSync();
      } else {
        this.prune();
      }
    });

    this._emitter = new EventEmitter();
  }

  async doSync() {
    return await this.sync.sync();
  }

  async getList() {
    return await this.sync.getList();
  }

  async add(guid: string) {
    const result = await this.sync.add(guid);
    this._emitter.emit('change');
    return result;
  }

  async remove(guid: string) {
    const result = await this.sync.remove(guid);
    this._emitter.emit('change');
    return result;
  }

  async prune() {
    const result = await this.sync.prune();
    this._emitter.emit('change');
    return result;
  }

  /**
   * @returns {module:events.internal.EventEmitter}
   */
  get events() {
    return this._emitter;
  }
}

export default new BlockListService();
