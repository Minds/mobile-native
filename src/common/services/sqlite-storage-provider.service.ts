//@ts-nocheck
import SqliteService from "./sqlite.service";

/**
 * Sqlite storage provider service
 */
class SqliteStorageProviderService {
  constructor() {
    this.dbService = new SqliteService('minds1.db');
  }

  async get() {
    await this.dbService.init();
    return this.dbService;
  }
}

export default new SqliteStorageProviderService();