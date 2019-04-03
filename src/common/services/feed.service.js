import apiService from "./api.service";
import sessionService from "./session.service";
import entitiesService from "./entities.service";
import blockListService from "./block-list.service";
import FeedsSync from "../../lib/minds-sync/services/FeedsSync";
import sqliteStorageProviderService from "./sqlite-storage-provider.service";
import hashCode from "../helpers/hash-code";

class FeedsService {

  constructor() {
    const storageAdapter = sqliteStorageProviderService.get();
    this.sync = new FeedsSync(apiService, storageAdapter, 15, 600);

    this.sync.setResolvers({
      stringHash: value => hashCode(value),
      currentUser: () => sessionService.guid,
      blockedUserGuids: async () => await blockListService.getList(),
      fetchEntities: async guids => await entitiesService.fetch(guids),
      prefetchEntities: async guids => await entitiesService.prefetch(guids),
    });

    this.sync.setUp();

    setTimeout(() => {
      this.gc();
    }, 60000);
  }

  async get(opts) {
    return await this.sync.get(opts);
  }

  async gc(opts) {
    return await this.sync.gc(opts);
  }

}

export default new FeedsService();