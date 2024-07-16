import type { LogService } from '~/common/services/log.service';
import type { Storages } from '~/common/services/storage/storages.service';

const KEEP_SECONDS = 60 * 60 * 48; // 48 hours

/**
 * Portrait content service
 */
export class PortraitContentService {
  private _seen: Map<string, number> = new Map();
  private _seenLoaded = false;

  constructor(private log: LogService, private storages: Storages) {}

  /**
   * Mark as seen
   * @param {string} urn
   */
  seen(urn: string) {
    try {
      this._seen.set(urn, Math.floor(Date.now() / 1000));
    } catch (err) {
      this.log.exception('[PortraitContentService]', err);
    }
  }

  /**
   * Get the seen urns
   */
  async getSeen(): Promise<Map<string, number> | null> {
    try {
      if (!this._seenLoaded) {
        const seen: any = this.storages.userPortrait?.getObject('seen');
        if (seen) {
          this._seen = new Map(Object.entries(seen));
          this.cleanOld();
        }
        this._seenLoaded = true;
      }
      return this._seen;
    } catch (err) {
      this.log.exception('[PortraitContentService]', err);

      return null;
    }
  }

  /**
   * Save the seen urns
   */
  save() {
    try {
      this.storages.userPortrait?.setObject(
        'seen',
        Object.fromEntries(this._seen),
      );
    } catch (err) {
      this.log.exception('[PortraitContentService]', err);
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
      this.log.exception('[PortraitContentService]', err);
    }
  }
}
