import { computed, action, observable, decorate } from 'mobx';

import ActivityModel from '../newsfeed/ActivityModel';
import {
  MINDS_CDN_URI
} from '../config/Config';

/**
 * Comment model
 */
export default class CommentModel extends ActivityModel {

  @observable expanded = false;

  @action
  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  /**
   * Get the activity thumb source
   * {uri: 'http...'}
   * @param {string} size
   */
  getThumbSource(size = 'medium') {
    // for gif use always the same size to take adventage of the cache (they are not resized)
    if (this.isGif()) size = 'medium';
    if (this.custom_type == 'batch') {
      return { uri: MINDS_CDN_URI + 'fs/v1/thumbnail/' + (this.attachment_guid || this.entity_guid) + '/' + size };
    }
    return { uri: MINDS_CDN_URI + 'fs/v1/thumbnail/' + (this.attachment_guid || this.guid)  + '/' + size };
  }

}

/**
 * Define model observables
 */
decorate(CommentModel, {
  'replies_count': observable,
});