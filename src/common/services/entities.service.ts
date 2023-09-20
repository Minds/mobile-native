//@ts-nocheck
import difference from 'lodash/difference';

import apiService from './api.service';
import { isAbort, isApiForbidden } from './ApiErrors';
import GroupModel from '../../groups/GroupModel';
import UserModel from '../../channel/UserModel';
import BlogModel from '../../blogs/BlogModel';
import ActivityModel from '../../newsfeed/ActivityModel';
import entitiesStorage from './storage/entities.storage';

// types
import type { FeedRecordType } from './feeds.service';
import type BaseModel from '../BaseModel';

/**
 * Entities services
 */
class EntitiesService {
  /**
   * Constructor
   */
  constructor() {
    // delete the cache when activities are deleted
    ActivityModel.events.on('deleteEntity', activity =>
      this.deleteFromCache(activity.urn),
    );
  }

  /**
   * Delete an entity from the cache
   * @param {string} urn
   */
  deleteFromCache(urn: string) {
    entitiesStorage.remove(urn);
  }

  /**
   * Delete an entity from the cache
   * @param {Array<string>} urn
   */
  deleteManyFromCache(urns: Array<string>) {
    entitiesStorage.removeMany(urns);
  }

  /**
   * Get entities from feed
   * @param {Array} feed
   * @param {Mixed} abortTag
   * @param {boolean} asActivities
   */
  async getFromFeed(
    feed: Array<FeedRecordType>,
    abortTag: any,
    asActivities: boolean = false,
  ): Promise<Array<BaseModel>> {
    if (!feed || !feed.length) {
      return [];
    }

    let urnsToFetch = [];
    const urnsToResync = [];
    const entities = [];
    const entitiesMap = new Map();

    for (const feedItem of feed) {
      if (feedItem.entity) {
        // fix entity urn is different than feed urn
        feedItem.entity.urn = feedItem.urn;

        // store it on cache
        this.save(feedItem.entity);

        const entity = this.mapToModel(feedItem.entity);

        entitiesMap.set(entity.urn, entity);
      } else {
        urnsToFetch.push(feedItem.urn);
      }
    }

    // if we have urnsToFetch we try to load from the storage first
    if (urnsToFetch.length > 0) {
      const localEntities = entitiesStorage
        .readMany(urnsToFetch)
        .filter(e => e !== null);
      if (localEntities.length > 0) {
        urnsToFetch = difference(
          urnsToFetch,
          localEntities.map((m: any): string => m.urn),
        );

        // we add to resync list
        localEntities.forEach((entityObj: any) => {
          urnsToResync.push(entityObj.urn);
          const entity = this.mapToModel(entityObj);
          entitiesMap.set(entity.urn, entity);
        });
      }
    }

    // Fetch entities we don't have
    if (urnsToFetch.length) {
      try {
        const fetchedEntities = await this.fetch(
          urnsToFetch,
          abortTag,
          asActivities,
        );

        if (fetchedEntities) {
          fetchedEntities.forEach(entity => {
            entitiesMap.set(entity.urn, this.mapToModel(entity));
            this.save(entity);
          });
        }
      } catch (err) {
        // we ignore the fetch error if there are local entities to show
        if (urnsToResync.length === 0 || isAbort(err)) throw err;
      }
    }

    // Fetch entities asynchronously
    if (urnsToResync.length) {
      this.fetch(urnsToResync, abortTag, asActivities).then(fetchedEntities => {
        if (fetchedEntities) {
          // update entities
          fetchedEntities.forEach(entityObj => {
            entitiesMap.get(entityObj.urn)?.update(entityObj);
            this.save(entityObj);
          });
        }
      });
    }

    for (const feedItem of feed) {
      const entity = entitiesMap.get(feedItem.urn);
      if (entity) {
        entities.push(entity);
      } else {
        console.log('ENTITY MISSING ' + feedItem.urn);
      }
    }

    return entities;
  }

  /**
   * Return and fetch a single entity via a urn
   * @param {string} urn
   * @param {BaseModel} defaultEntity
   * @param {boolean} asActivities
   * @return Object
   */
  async single(
    urn: string,
    defaultEntity: BaseModel | null = null,
    asActivities: boolean = false,
  ): BaseModel {
    if (!urn.startsWith('urn:')) {
      // not a urn, so treat as a guid
      urn = `urn:activity:${urn}`; // and assume activity
    }

    // from sql storage
    let entity = entitiesStorage.read(urn);

    if (entity) {
      entity = this.mapToModel(entity);
    } else {
      if (defaultEntity) {
        // if there not exist in memory or sql we use the default entity and we update it later
        entity = defaultEntity;
      } else {
        // we fetch from the server
        const fetchedEntities = await this.fetch(
          [urn],
          null,
          asActivities,
          e => (e.urn = urn),
        );
        if (fetchedEntities && fetchedEntities[0]) {
          return this.mapToModel(fetchedEntities[0]);
        }
        return null;
      }
    }

    if (entity) {
      // Update in the background
      this.fetch([urn], null, asActivities, e => (e.urn = urn)).then(
        fetchedEntities => {
          if (
            fetchedEntities &&
            fetchedEntities[0] &&
            entity &&
            entity.update
          ) {
            entity.update(fetchedEntities[0]);
          }
        },
      );
    }

    return entity;
  }

  /**
   * Fetch entities
   * @param {Array<String>} urns
   * @param {mixed} abortTag
   * @param {boolean} asActivities
   * @return []
   */
  async fetch(
    urns: Array<string>,
    abortTag: any,
    asActivities: boolean = false,
    transform?: (entity: any) => void,
  ): Promise<void> {
    try {
      const response: any = await apiService.get(
        'api/v2/entities/',
        { urns, as_activities: asActivities ? 1 : 0 },
        abortTag,
      );

      const entities = [];

      for (const entity of response.entities) {
        if (transform) {
          transform(entity);
        }
        entities.push(entity);
      }

      return entities;
    } catch (err) {
      // if the server response is a 403
      if (isApiForbidden(err)) {
        // if the entity exists in the cache, remove the permissions to force the UI update
        urns.forEach((urn: string) => {
          const cache = this.entities.get(urn);

          if (cache) {
            // remove permissions
            cache.entity.setPermissions({ permissions: [] });
            // if the entity is attached to a list we remove if from the list
            cache.entity.removeFromList();
          }
        });
        // remove it from memory and local storage
        this.deleteManyFromCache(urns);
        return;
      }
      throw err;
    }
  }

  save(entity: any) {
    entitiesStorage.save(entity);
  }

  /**
   * Map object to model
   * @param {Object} entity
   */
  mapToModel(entity: Object): BaseModel {
    switch (entity.type) {
      case 'activity':
        return ActivityModel.create(entity);
      case 'user':
        return UserModel.create(entity);
      case 'group':
        return GroupModel.create(entity);
      case 'object':
        switch (entity.subtype) {
          case 'blog':
            return BlogModel.create(entity);
          case 'image':
          case 'video':
            return ActivityModel.create(entity);
        }
    }
    return ActivityModel.create(entity);
  }
}

export default new EntitiesService();
