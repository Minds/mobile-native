import sqliteStorageProviderService from "../sqlite-storage-provider.service";
import logService from "../log.service";
import moment from "moment";

/**
 * Feeds Storage
 */
export class FeedsStorage {

  /**
   * @var {SqliteService}
   */
  db;

  /**
   * Persist a FeedsService to the cache
   * @param {FeedsService} feed
   */
  async save(feed) {
    // we ignore empty feeds
    if (feed.feed.length === 0) return;

    const key = this.getKey(feed);

    try {
      await this.getDb();

      const params = [
        key,
        0,
        JSON.stringify({
          feed: this.map(feed.feed),
          next: feed.pagingToken,
          fallbackAt: feed.fallbackAt,
          fallbackIndex: feed.fallbackIndex,
        }),
        Math.floor(Date.now() / 1000),
      ];
      await this.db.executeSql(
        'REPLACE INTO feeds (key, offset, data, updated) values (?,?,?,?)',
        params,
      );
    } catch (err) {
      logService.exception('[FeedsStorage]', err);
    }
  }

  /**
   * Read a FeedsService from the cache
   * @param {FeedsService} feed
   */
  async read(feed) {
    await this.getDb();

    try {
      const key = this.getKey(feed);
      const [result] = await this.db.executeSql(
        'SELECT * FROM feeds WHERE key=? AND offset=?;',
        [key, 0],
      );

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
  async removeAll() {
    await this.getDb();
    return this.db.executeSql('DELETE FROM feeds');
  }

  /**
   * Remove feeds older than given days
   * @param {integer} days
   */
  async removeOlderThan(days) {
    const when = moment().subtract(days, 'days');
    await this.getDb();
    this.db.executeSql('DELETE FROM feeds WHERE updated < ?', [when.format("X")]);
  }

  /**
   * Map feeds for storage
   * @param {Array} data
   */
  map(data) {
    return data.map(m => ({urn: m.urn, timestamp: m.timestamp ? Math.floor(m.timestamp/ 1000) : null, owner_guid: m.owner_guid}))
  }

  /**
   * Generate the key from the state of the feeds service
   * @param {FeedsService} feed
   */
  getKey(feed)
  {
    return feed.endpoint + JSON.stringify(feed.params);
  }

  /**
   * Get the sqlite service
   */
  async getDb() {
    if (!this.db) {
      this.db = await sqliteStorageProviderService.get();
    }
    return this.db;
  }
}

export default new FeedsStorage;