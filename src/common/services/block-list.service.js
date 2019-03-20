import BlockListSync from "../../lib/minds-sync/services/BlockListSync";
import apiService from "./api.service";
import sqliteStorageProviderService from "./sqlite-storage-provider.service";

class BlockListService {
  constructor() {
    const storageAdapter = sqliteStorageProviderService.get();
    this.sync = new BlockListSync(apiService, storageAdapter);

    this.sync.setUp();

    // TODO: Setup session listener
  }

  async sync() {
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
}

export default new BlockListService();