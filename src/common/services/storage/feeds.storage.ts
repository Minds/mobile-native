import logService from '../log.service';
import { storages } from '../storage/storages.service';

/**
 * Feeds Storage
 */
export class FeedsStorage {
  /**
   * Persist a FeedsService to the cache
   * @param {FeedsService} feed
   */
  save(feed) {
    // we ignore empty feeds
    if (feed.feed.length === 0) return;
    try {
      const key = this.getKey(feed);

      storages.userCache?.setMap(key, {
        feed: this.map(feed.feed),
        next: feed.pagingToken,
        fallbackAt: feed.fallbackAt,
        fallbackIndex: feed.fallbackIndex,
      });
    } catch (err) {
      logService.exception('[FeedsStorage]', err);
    }
  }

  /**
   * Read a FeedsService from the cache
   * @param {FeedsService} feed
   */
  read(feed) {
    try {
      const key = this.getKey(feed);

      return storages.userCache?.getMap(key) || null;
    } catch (err) {
      logService.exception('[FeedsStorage]', err);
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

export default new FeedsStorage();
