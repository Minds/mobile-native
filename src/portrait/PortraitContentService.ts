import moment from 'moment';

import sqliteStorageProviderService from '../common/services/sqlite-storage-provider.service';
import logService from '../common/services/log.service';

/**
 * Portrait content service
 */
export class PortraitContentService {
  /**
   * Mark as seen
   * @param {string} urn
   */
  async seen(urn: string) {
    try {
      const db = await sqliteStorageProviderService.get();
      await db.executeSql(
        'REPLACE INTO seen_portrait_entities (urn, updated) values (?,?)',
        [urn, Math.floor(Date.now() / 1000)],
      );
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
    }
  }

  /**
   * Get the seen urns
   */
  async getSeen() {
    try {
      const db = await sqliteStorageProviderService.get();

      // It should be ordered to do a binary search
      const [result] = await db.executeSql<{ urn: string }>(
        'SELECT urn FROM seen_portrait_entities ORDER BY urn',
      );

      const rows = result.rows.raw();

      if (!rows) {
        return null;
      }

      const urns: Array<string> = [];

      rows.forEach((row: { urn: string }) => {
        return urns.push(row.urn);
      });

      return urns;
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
      return null;
    }
  }

  /**
   * Remove seen_portrait_entities older than given days
   *
   * @param {integer} days
   */
  async removeOlderThan(days: number) {
    try {
      const when = moment().subtract(days, 'days');
      const db = await sqliteStorageProviderService.get();
      db.executeSql('DELETE FROM seen_portrait_entities WHERE updated < ?', [
        when.format('X'),
      ]);
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
    }
  }
}

export default new PortraitContentService();
