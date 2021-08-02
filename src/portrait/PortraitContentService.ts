import logService from '../common/services/log.service';
import { storages } from '../common/services/storage/storages.service';

/**
 * Portrait content service
 */
export class PortraitContentService {
  /**
   * Mark as seen
   * @param {string} urn
   */
  seen(urn: string) {
    try {
      storages.userPortrait?.setInt(urn, Math.floor(Date.now() / 1000));
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
    }
  }

  /**
   * Get the seen urns
   */
  async getSeen(): Promise<Map<string, number> | null> {
    try {
      const urns: Array<[string, number]> =
        (await storages.userPortrait?.indexer.numbers.getAll()) || [];

      if (
        urns &&
        Array.isArray(urns[0]) &&
        urns[0][1] < Date.now() / 1000 - 172800
      ) {
        this.cleanOld(urns);
      }

      return new Map(urns);
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
      return null;
    }
  }

  /**
   * Delete old information (older than 48hs)
   */
  async cleanOld(urns: Array<[string, number]>) {
    const threshold = Date.now() / 1000 - 172800;
    try {
      urns.forEach(data => {
        if (data[1] < threshold) {
          storages.userPortrait?.removeItem(data[0]);
        }
      });
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
    }
  }
}

export default new PortraitContentService();
