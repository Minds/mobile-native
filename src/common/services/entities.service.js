import EntitiesSync from "../../lib/minds-sync/services/EntitiesSync";
import apiService from "./api.service";
import sqliteStorageProviderService from "./sqlite-storage-provider.service";

class EntitiesService {
  constructor() {
    const storageAdapter = sqliteStorageProviderService.get();
    this.sync = new EntitiesSync(apiService, storageAdapter, 15);

    this.sync.setUp();

    // TODO: Setup GC timers
  }

  async single(guid) {
    try {
      const entities = await this.fetch([guid]);

      if (!entities || !entities[0]) {
        return false;
      }

      return entities[0];
    } catch (e) {
      console.error('EntitiesService.get', e);
      return false;
    }
  }

  async fetch(guids) {
    if (!guids || !guids.length) {
      return [];
    }

    const urns = guids.map(guid => `urn:entity:${guid}`);

    return await this.sync.get(urns);
  }

  async prefetch(guids) {
    if (!guids || !guids.length) {
      return true;
    }

    const urns = guids.map(guid => `urn:entity:${guid}`);

    return await this.sync.sync(urns);
  }
}

export default new EntitiesService();