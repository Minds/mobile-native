import BlockListSync from "../../lib/minds-sync/services/BlockListSync";
import apiService from "./api.service";
import sqliteStorageProviderService from "./sqlite-storage-provider.service";
import sessionService from "./session.service";

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
  }

  async doSync() {
    return await this.sync.sync();
  }

  async getList() {
    return await this.sync.getList();
  }

  async add(guid: string) {
    return await this.sync.add(guid);
  }

  async remove(guid: string) {
    return await this.sync.remove(guid);
  }

  async prune() {
    return await this.sync.prune();
  }
}

export default new BlockListService();
