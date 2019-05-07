import BlockListSync from "../../lib/minds-sync/services/BlockListSync";
import apiService from "./api.service";
import sqliteStorageProviderService from "./sqlite-storage-provider.service";
import sessionService from "./session.service";
import { EventEmitter } from "events";

class BlockListService {
  constructor() {
    // Properties

    this.sync = new BlockListSync(apiService, sqliteStorageProviderService.get());

    this._emitter = new EventEmitter();

    this._cached = [];

    // Initialization

    this.sync.setUp();

    // Events / Reactiveness

    sessionService.onSession(token => {
      if (token) {
        this.doSync();
      } else {
        this.prune();
      }
    });

    this._emitter.on('change', async () => {
      this._cached = await this.getList();
    });
  }

  async doSync() {
    await this.sync.sync();
    await this.getList();
  }

  async getList() {
    const list = (await this.sync.getList()) || [];
    this._cached = list;
    return [...list];
  }

  /**
   * @returns {String[]}
   */
  getCachedList() {
    return [...this._cached];
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
