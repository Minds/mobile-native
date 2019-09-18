import { observable, action } from 'mobx';

import {toggleComments, follow, unfollow, toggleFeatured, monetize, update, setViewed} from '../../newsfeed/NewsfeedService';

import channelService from '../../channel/ChannelService';
import OffsetListStore from './OffsetListStore';
import logService from '../services/log.service';

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
  async addViewed(entity) {
    if (!this.viewed.get(entity.guid)) {
      this.viewed.set(entity.guid, true);
      let response;
      try {
        const meta = this.metadataService ? this.metadataService.getEntityMeta(entity) : {};
        response = await setViewed(entity, meta);
      } catch (e) {
        this.viewed.delete(entity.guid);
        throw new Error('There was an issue storing the view');
      }
    }
  }
}
