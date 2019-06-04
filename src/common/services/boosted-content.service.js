import apiService from "./api.service";
import sessionService from "./session.service";
import entitiesService from "./entities.service";
import blockListService from "./block-list.service";
import BoostedContentSync from "../../lib/minds-sync/services/BoostedContentSync";
import sqliteStorageProviderService from "./sqlite-storage-provider.service";
import hashCode from "../helpers/hash-code";

class BoostedContentService {

  initialized = false;

  constructor() {
    const storageAdapter = sqliteStorageProviderService.get();
    this.sync = new BoostedContentSync(apiService, storageAdapter, 5 * 60, 15 * 60, 500);

    this.sync.setResolvers({
      currentUser: () => sessionService.guid,
      blockedUserGuids: async () => await blockListService.getList(),
      fetchEntities: async guids => await entitiesService.fetch(guids),
    });

    this.sync.setUp();

    sessionService.onSession((is) => {
      if (is) {
        this.initialized = true;

        // UNCOMMENT!
        this.sync.setRating(2);
        // this.sync.setRating(sessionService.getUser().boost_rating || null);
      } else {
        if (this.initialized) {
          this.sync.destroy();
        }
      }
    });

    setTimeout(() => {
      this.gc();
    }, 60000);
  }

  async get(opts) {
    return await this.sync.get(opts);
  }

  async fetch(opts) {
    return await this.sync.fetch(opts);
  }

  async gc(opts) {
    return await this.sync.gc(opts);
  }

}

export default new BoostedContentService();
