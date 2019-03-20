import SqliteService from "./sqlite.service";
import SqliteStorageAdapter from "../../lib/minds-sync/adapters/SqliteStorageAdapter";

/**
 * Sqlite storage provider service
 */
class SqliteStorageProviderService {
  constructor() {
    const mindsDb = new SqliteService('minds1.db');
    this.adapter = new SqliteStorageAdapter(mindsDb);
  }

  get() {
    return this.adapter;
  }
}

export default new SqliteStorageProviderService();