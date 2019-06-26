import apiService from "./api.service";
import sessionService from "./session.service";
import storageService from "./storage.service";
import logService from "./log.service";

export class BlockListService {

  blocked: Map = new Map();

  constructor() {
    sessionService.onSession(async (token) => {
      if (token) {
        await this.loadFromStorage();
        this.fetch();
      } else {
        this.prune();
      }
    });
  }

  async loadFromStorage() {
    const guids = await storageService.getItem('@minds:blocked');
    if (guids) {
      guids.forEach(g => this.blocked.set(g));
    }
  }

  async fetch() {
    try {
      const response = await apiService.get('api/v1/block', { sync: 1, limit: 10000 })

      if (response.guids) {
        this.blocked.clear();
        response.guids.forEach(g => this.blocked.set(g));
      }

      storageService.setItem('@minds:blocked', response.guids); // save to storage
    } catch (err) {
      logService.exception('[BlockListService]', err);
    }
  }

  async prune() {
    await storageService.removeItem('@minds:blocked');
  }

  async getList() {
    return this.blocked;
  }

  async add(guid: string) {
    if (this.blocked.indexOf(guid) < 0)
      this.blocked.set( guid );
    storageService.setItem('@minds:blocked', this.blocked.keys());
  }

  async remove(guid: string) {
    this.blocked.delete(guid);
    storageService.setItem('@minds:blocked', this.blocked.keys());
  }
}

export default new BlockListService();
