import sqliteStorageProviderService from "../sqlite-storage-provider.service";
import logService from "../log.service";

/**
 * Feeds Storage
 */
export class EntitiesStorage {

  db;

  async save(entity) {
    if (!entity.urn) return;

    try {
      await this.getDb();
      await this.db.executeSql('REPLACE INTO entities (urn, data, updated) values (?,?,?)', [entity.urn, JSON.stringify(entity), Math.floor(Date.now() / 1000)]);
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
    }
  }

  async read(urn) {
    await this.getDb();

    try {
      const [result] = await this.db.executeSql('SELECT * FROM entities WHERE urn=?;', [urn]);

      const rows = result.rows.raw();

      if (!rows[0] || !rows[0].data) return null;

      return JSON.parse(rows[0].data);
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
      return null;
    }
  }

  async readMany(urns) {
    await this.getDb();

    try {
      const urnsIn = "('" + urns.join("','") + "')";

      const [result] = await this.db.executeSql('SELECT * FROM entities WHERE urn IN ' + urnsIn);

      const rows = result.rows.raw();

      const entities = [];

      rows.forEach(row => {
        entities.push(JSON.parse(row.data));
      });

      return entities;
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
      return null;
    }
  }

  /**
   * Remove entity
   * @param {string} urn
   */
  remove(urn) {
    return sqlService.db.executeSql('DELETE FROM entities WHERE urn=?', [urn]);
  }


  async getDb() {
    if (!this.db) {
      this.db = await sqliteStorageProviderService.get();
    }
    return this.db;
  }
}

export default new EntitiesStorage;