//@ts-nocheck
import apiService from "./api.service";
import sessionService from "./session.service";
import storageService from "./storage.service";
import logService from "./log.service";
import {observable, action} from 'mobx';

export class BlockListService {

  @observable blocked: Map = new Map();

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

  has(guid) {
    return this.blocked.has(guid);
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
    this.blocked.clear();
    await storageService.setItem('@minds:blocked', []);
  }

  async getList() {
    return this.blocked;
  }

  @action
  async add(guid: string) {
    this.blocked.set( guid );
    storageService.setItem('@minds:blocked', this.blocked.keys());
  }

  @action
  async remove(guid: string) {
    this.blocked.delete(guid);
    storageService.setItem('@minds:blocked', this.blocked.keys());
  }
}

export default new BlockListService();
