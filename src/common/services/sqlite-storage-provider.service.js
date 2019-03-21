import SqliteService from "./sqlite.service";
import SqliteStorageAdapter from "../../lib/minds-sync/adapters/SqliteStorageAdapter";

/**
 * Sqlite storage provider service
 */
class SqliteStorageProviderService {
  constructor() {
    this.dbService = new SqliteService('minds1.db');
  }

  get() {
    return new SqliteStorageAdapter(this.dbService);
  }
}

export default new SqliteStorageProviderService();