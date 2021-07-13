import { setViewed } from '../../newsfeed/NewsfeedService';
import { isNetworkError } from '../services/api.service';
import type MetadataService from '../services/metadata.service';

/**
 * Feed list viewed logic
 */
export default class Viewed {
  /**
   * @var {Map} viewed viewed entities list
   */
  viewed = new Map();

  /**
   * Clear viewed list
   */
  clearViewed() {
    this.viewed.clear();
  }

  /**
   * Add an entity to the viewed list and inform to the backend
   */
  async addViewed(
    entity,
    metadataService: MetadataService,
    medium?: string,
    position?: number,
  ) {
    if (medium || !this.viewed.get(entity.guid)) {
      !medium && this.viewed.set(entity.guid, true);
      try {
        const meta = metadataService
          ? metadataService.getEntityMeta(entity, medium, position)
          : {};
        await setViewed(entity, meta);
      } catch (e) {
        !medium && this.viewed.delete(entity.guid);
        if (!isNetworkError(e)) {
          throw e;
        }
      }
    }
  }
}
