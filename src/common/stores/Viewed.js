import { setViewed } from "../../newsfeed/NewsfeedService";

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
   * @param {MetadataService|undefined} metadataServie
   */
  async addViewed(entity, metadataServie) {
    if (!this.viewed.get(entity.guid)) {
      this.viewed.set(entity.guid, true);
      let response;
      try {
        const meta = metadataServie ? metadataServie.getEntityMeta(entity) : {};
        response = await setViewed(entity, meta);
      } catch (e) {
        this.viewed.delete(entity.guid);
        throw new Error('There was an issue storing the view');
      }
    }
  }
}