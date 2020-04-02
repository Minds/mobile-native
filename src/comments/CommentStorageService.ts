//@ts-nocheck
import sqliteStorageProviderService from '../common/services/sqlite-storage-provider.service';
import logService from '../common/services/log.service';
import moment from 'moment';

/**
 * Comment storage service
 */
export class CommentStorageService {

  /**
   * @var {SqliteService}
   */
  db;

  /**
   * Get the sqlite service
   */
  async getDb() {
    if (!this.db) {
      this.db = await sqliteStorageProviderService.get();
    }
    return this.db;
  }

  /**
   * Read a page from the storage
   *
   * @param {string} entityGuid
   * @param {string} parentPath
   * @param {boolean} descending
   * @param {string} offset
   * @param {string} focusedUrn
   */
  async read(entityGuid: string, parentPath: string, descending: boolean, offset: string, focusedUrn: string) {
    try {
      await this.getDb();

      const params = [
        entityGuid,
        parentPath,
        descending,
        offset || '',
        focusedUrn || ''
      ];

      const [result] = await this.db.executeSql('SELECT data FROM comments_feeds WHERE parent = ? AND parent_path = ? AND descending = ? AND offset = ? AND focused_urn = ?;', params);

      const rows = result.rows.raw();

      if (!rows[0] || !rows[0].data) return null;

      return JSON.parse(rows[0].data);
    } catch (err) {
      logService.exception('[CommentStorageService]', err);
      return null;
    }
  }

  /**
   * Write a page to the storage
   *
   * @param {string} entityGuid
   * @param {string} parentPath
   * @param {boolean} descending
   * @param {string} offset
   * @param {string} focusedUrn
   * @param {Object} data
   */
  async write(entityGuid: string, parentPath: string, descending: boolean, offset: string, focusedUrn: string, data: Object) {
    try {
      await this.getDb();
      await this.db.executeSql('REPLACE INTO comments_feeds (parent, parent_path, descending, offset, focused_urn, data, updated) values (?,?,?,?,?,?,?)',
        [
          entityGuid,
          parentPath,
          descending,
          offset || '',
          focusedUrn || '',
          JSON.stringify(this.clean(data)),
          Math.floor(Date.now() / 1000)
        ]
      );
    } catch (err) {
      logService.exception('[CommentStorageService]', err);
      console.log(err)
    }
  }

  /**
   * Remove all comments feeds
   */
  async removeAll() {
    await this.getDb();
    return this.db.executeSql('DELETE FROM comments_feeds');
  }

  /**
   * Remove comments feeds older than given days
   *
   * @param {integer} days
   */
  async removeOlderThan(days) {
    const when = moment().subtract(days, 'days');
    await this.getDb();
    this.db.executeSql('DELETE FROM comments_feeds WHERE updated < ?', [when.format("X")]);
  }

  /**
   * Clean repeated data to reduce the stored size
   *
   * @param {Object} data
   */
  clean(data: Object){
    data.comments.forEach(comment => {
      delete(comment.luid);
      delete(comment.body);
    });
    delete(data.status);
    return data;
  }
}

export default new CommentStorageService();