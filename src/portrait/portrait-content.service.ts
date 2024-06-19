import logService from '../common/services/log.service';
import { storagesService } from '~/common/services';

const KEEP_SECONDS = 60 * 60 * 48; // 48 hours

/**
 * Portrait content service
 */
export class PortraitContentService {
  private _seen: Map<string, number> = new Map();
  private _seenLoaded = false;

  /**
   * Mark as seen
   * @param {string} urn
   */
  seen(urn: string) {
    try {
      this._seen.set(urn, Math.floor(Date.now() / 1000));
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
    }
  }

  /**
   * Get the seen urns
   */
  async getSeen(): Promise<Map<string, number> | null> {
    try {
      if (!this._seenLoaded) {
        const seen: any = storagesService.userPortrait?.getObject('seen');
        if (seen) {
          this._seen = new Map(Object.entries(seen));
          this.cleanOld();
        }
        this._seenLoaded = true;
      }
      return this._seen;
    } catch (err) {
      logService.exception('[PortraitContentService]', err);

      return null;
    }
  }

  /**
   * Save the seen urns
   */
  save() {
    try {
      storagesService.userPortrait?.setObject(
        'seen',
        Object.fromEntries(this._seen),
      );
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
    }
  }

  /**
   * Delete old information (older than 48hs)
   */
  cleanOld() {
    const threshold = Date.now() / 1000 - KEEP_SECONDS;
    try {
      this._seen.forEach((value, key) => {
        if (value < threshold) {
          this._seen.delete(key);
        }
      });
    } catch (err) {
      logService.exception('[PortraitContentService]', err);
    }
  }
}

export default new PortraitContentService();
