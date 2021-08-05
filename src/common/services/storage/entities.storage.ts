import logService from '../log.service';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import { storages } from './storages.service';

/**
 * Feeds Storage
 */
export class EntitiesStorage {
  /**
   * Save an entity
   */
  save(entity: ActivityModel | BlogModel) {
    if (!entity.urn) {
      return;
    }

    try {
      storages.userCache?.setMap(entity.urn, entity);
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
    }
  }

  /**
   * Read one entity
   * @param {string} urn
   */
  read(urn) {
    try {
      return storages.userCache?.getMap(urn) || null;
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
      return null;
    }
  }

  /**
   * Read many entities
   * @param {Array} urns
   */
  readMany(urns) {
    try {
      const entities: Array<ActivityModel | BlogModel> = [];
      urns.forEach(urn => {
        const entity = storages.userCache?.getMap<ActivityModel | BlogModel>(
          urn,
        );
        if (entity) {
          entities.push(entity);
        }
      });

      return entities;
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
      return [];
    }
  }

  /**
   * Remove entity
   * @param {string} urn
   */
  remove(urn) {
    storages.userCache?.removeItem(urn);
  }

  /**
   * Remove many entities
   * @param {Array} urns
   */
  removeMany(urns: Array<string>) {
    urns.forEach(urn => this.remove(urn));
  }
}

export default new EntitiesStorage();
