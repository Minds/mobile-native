import { setViewed } from "../../newsfeed/NewsfeedService";
import { isNetworkFail } from "../helpers/abortableFetch";

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
   * @param {BaseModel} entity
   * @param {MetadataService|undefined} metadataService
   */
  async addViewed(entity, metadataService) {
    if (!this.viewed.get(entity.guid)) {
      this.viewed.set(entity.guid, true);
      try {
        const meta = metadataService ? metadataService.getEntityMeta(entity) : {};
        await setViewed(entity, meta);
      } catch (e) {
        this.viewed.delete(entity.guid);
        if (!isNetworkFail(e)) {
          throw e;
        }
      }
    }
  }
}