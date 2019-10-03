import { action } from 'mobx';

import { setViewed } from '../../newsfeed/NewsfeedService';

import OffsetListStore from './OffsetListStore';
import { isNetworkFail } from '../helpers/abortableFetch';

/**
 * Infinite scroll list that inform viewed
 */
export default class OffsetFeedListStore extends OffsetListStore {

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

  async clearList(updateLoaded = true) {
    this.clearViewed();
    return super.clearList(updateLoaded);
  }

  @action
  async refresh() {
    this.clearViewed();
    return super.refresh();
  }

  /**
   * Add an entity to the viewed list and inform to the backend
   * @param {BaseModel} entity
   */
  async addViewed(entity, isVideo = false) {
    if (!this.viewed.get(entity.guid)) {
      this.viewed.set(entity.guid, true);
      try {
        const meta = this.metadataService ? this.metadataService.getEntityMeta(entity) : {};
        await setViewed(entity, meta, isVideo);
      } catch (e) {
        this.viewed.delete(entity.guid);
        if (!isNetworkFail(e)) {
          throw e;
        }
      }
    }
  }
}
