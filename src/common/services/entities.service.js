import apiService from "./api.service";
import blockListService from "./block-list.service";
import { first } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

import GroupModel from "../../groups/GroupModel";
import UserModel from "../../channel/UserModel";
import BlogModel from "../../blogs/BlogModel";
import ActivityModel from "../../newsfeed/ActivityModel";
import stores from "../../../AppStores";
import { abort } from "../helpers/abortableFetch";

/**
 * Entities services
 */
class EntitiesService {

  /**
   * @var {Map} entities
   */
  entities: Map = new Map();

  async getFromFeed(feed, abortTag): Promise<EntityObservable[]> {

    if (!feed || !feed.length) {
      return [];
    }

    const blockedGuids = blockListService.blocked;
    const urnsToFetch = [];
    const urnsToResync = [];
    const entities = [];

    for (const feedItem of feed) {
      if (feedItem.entity) {
        this.addEntity(feedItem.entity);
      }
      if (!this.entities.has(feedItem.urn)) {
        urnsToFetch.push(feedItem.urn);
      }
      if (this.entities.has(feedItem.urn) && !feedItem.entity) {
        urnsToResync.push(feedItem.urn);
      }
    }

    // Fetch entities we don't have

    if (urnsToFetch.length) {
      await this.fetch(urnsToFetch, abortTag);
    }

    // Fetch entities, asynchronously, with no need to wait

    if (urnsToResync.length) {
      this.fetch(urnsToResync, abortTag);
    }

    for (const feedItem of feed) {
      if (!blockListService.has(feedItem.owner_guid)) {
        const entity = this.entities.get(feedItem.urn)
        if (entity) entities.push(entity);
      }
    }

    return entities;
  }

  /**
   * Return and fetch a single entity via a urn
   * @param urn string
   * @return Object
   */
  single(urn: string): EntityObservable {
    if (urn.indexOf('urn:') < 0) { // not a urn, so treat as a guid
      urn = `urn:activity:${urn}`; // and assume activity
    }

    this.entities[urn] = new BehaviorSubject(null);

    this.fetch([ urn ]); // Update in the background

    return this.entities[urn];
  }

  /**
   * Fetch entities
   * @param urns string[]
   * @return []
   */
  async fetch(urns: string[], abortTag: any): Promise<Array<Object>> {

    try {
      const response: any = await apiService.get('api/v2/entities/', { urns }, abortTag);

      console.log('FETCH ENTITIES', urns, response)

      for (const entity of response.entities) {
        this.addEntity(entity);
      }

      return response;
    } catch (err) {
      console.log(err)
      throw err;
    }
  }

  /**
   * Add or resync an entity
   * @param entity
   * @return void
   */
  addEntity(entity): void {
    const storedEntity = this.entities.get(entity.urn);
    if (storedEntity) {
      storedEntity.update(entity);
    } else {
      this.entities.set(entity.urn, this.mapToModel(entity));
    }
  }

  mapToModel(entity) {
    switch (entity.type) {
      case 'activity':
        return ActivityModel.create(entity)
      case 'user':
        return UserModel.create(entity);
      case 'group':
        return GroupModel.create(entity)
      case 'object':
        switch (entity.subtype) {
          case 'blog':
            return BlogModel.create(entity);
          case 'image':
          case 'video':
            return ActivityModel.create(entity);
        }
    }
  }
}

export default new EntitiesService();