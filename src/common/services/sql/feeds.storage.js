import sqliteStorageProviderService from "../sqlite-storage-provider.service";
import logService from "../log.service";
import moment from "moment";

/**
 * Feeds Storage
 */
export class FeedsStorage {

  db;

  async save(feed) {
    // we ignore empty feeds
    if (feed.feed.length === 0) return;

    const key = this.getKey(feed);

    try {
      await this.getDb();
      await this.db.executeSql('REPLACE INTO feeds (key, offset, data, updated) values (?,?,?,?)', [key, 0, JSON.stringify(this.map(feed.feed)), Math.floor(Date.now() / 1000)]);
    } catch (err) {
      logService.exception('[FeedsStorage]', err);
    }
  }

  async read(feed) {
    await this.getDb();

    try {
      const key = this.getKey(feed);
      const [result] = await this.db.executeSql('SELECT * FROM feeds WHERE key=? AND offset=?;', [key, 0]);

      const rows = result.rows.raw();

      if (!rows[0] || !rows[0].data) return null;

      return JSON.parse(rows[0].data);
    } catch (err) {
      logService.exception('[FeedsStorage]', err);
      return null;
    }
  }

  /**
   * Remove all feeds
   */
  removeAll() {
    return this.db.executeSql('DELETE FROM feeds');
  }

  /**
   * Remove feeds older than given days
   * @param {integer} days
   */
  removeOlderThan(days) {
    const when = moment().subtract(days, 'days');
    this.db.executeSql('DELETE FROM feeds WHERE updated < ?', [when.format("X")]);
  }


  map(data) {
    return data.map(m => ({urn: m.urn, timestamp: m.timestamp ? Math.floor(m.timestamp/ 1000) : null, owner_guid: m.owner_guid}))
  }

  getKey(feed)
  {
    return feed.endpoint + JSON.stringify(feed.params);
  }

  async getDb() {
    if (!this.db) {
      this.db = await sqliteStorageProviderService.get();
    }
    return this.db;
  }
}

export default new FeedsStorage;