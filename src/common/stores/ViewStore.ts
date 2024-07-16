import sp from '~/services/serviceProvider';
import { isNetworkError } from '../services/ApiErrors';
import type { MetadataService } from '../services/metadata.service';
import { MetadataMedium } from '../services/metadata.service';

/**
 * Feed list viewed logic
 */
export default class ViewStore {
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
  async view(
    entity,
    metadataService: MetadataService,
    medium?: MetadataMedium,
    position?: number,
  ) {
    if (medium || !this.viewed.get(entity.guid)) {
      !medium && this.viewed.set(entity.guid, true);
      try {
        const meta = metadataService.getClientMetadata(
          entity,
          medium,
          position,
        );
        await sp.resolve('newsfeed').recordView(entity, meta);
      } catch (e) {
        !medium && this.viewed.delete(entity.guid);
        if (!isNetworkError(e)) {
          throw e;
        }
      }
    }
  }
}
