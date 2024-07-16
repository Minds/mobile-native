import type { LogService } from '../log.service';
import type { Storages } from './storages.service';

/**
 * Feeds Storage
 */
export class FeedsStorage {
  constructor(private storages: Storages, private log: LogService) {}

  /**
   * Persist a FeedsService to the cache
   * @param {FeedsService} feed
   */
  save(feed) {
    // we ignore empty feeds
    if (feed.feed.length === 0) return;
    try {
      const key = this.getKey(feed);

      this.storages.userCache?.setObject(key, {
        feed: this.map(feed.feed),
        next: feed.pagingToken,
        fallbackAt: feed.fallbackAt,
        fallbackIndex: feed.fallbackIndex,
      });
    } catch (err) {
      this.log.exception('[FeedsStorage]', err);
    }
  }

  /**
   * Read a FeedsService from the cache
   * @param {FeedsService} feed
   */
  read(feed) {
    try {
      const key = this.getKey(feed);

      return this.storages.userCache?.getObject(key) || null;
    } catch (err) {
      this.log.exception('[FeedsStorage]', err);
      return null;
    }
  }

  /**
   * Map feeds for storage
   * @param {Array} data
   */
  map(data) {
    return data.map(m => ({
      urn: m.urn,
      owner_guid: m.owner_guid,
    }));
  }

  /**
   * Generate the key from the state of the feeds service
   * @param {FeedsService} feed
   */
  getKey(feed) {
    return feed.endpoint + JSON.stringify(feed.params);
  }
}
