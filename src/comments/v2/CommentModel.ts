import { observable, decorate, action } from 'mobx';

import ActivityModel from '../../newsfeed/ActivityModel';

/**
 * Comment model
 */
export default class CommentModel extends ActivityModel {
  expanded: boolean = false;
  entity_guid: string = '';
  child_path?: string;
  replies_count = 0;
  focused?: boolean;
  attachment_guid: string = '';
  custom_type: string = '';
  _guid: string = '';
  can_reply?: boolean;
  parent_guid_l2?: string;

  /**
   * The parent comment
   */
  parent = null;
  @action
  increaseReply() {
    this.replies_count++;
  }
  @action
  decreaseReply() {
    if (this.replies_count > 0) {
      this.replies_count--;
    }
  }

  //   /**
  //    * Get the activity thumb source
  //    * {uri: 'http...'}
  //    * @param {string} size
  //    */
  //   getThumbSource(size = 'medium') {
  //     if (this.thumbnails && this.thumbnails[size]) {
  //       return { uri: this.thumbnails[size], headers: api.buildHeaders() };
  //     }
  //     // for gif use always the same size to take adventage of the cache (they are not resized)
  //     if (this.isGif()) size = 'medium';
  //     if (this.custom_type == 'batch') {
  //       return {
  //         uri:
  //           MINDS_CDN_URI +
  //           'fs/v1/thumbnail/' +
  //           (this.attachment_guid || this.entity_guid) +
  //           '/' +
  //           size,
  //         headers: api.buildHeaders(),
  //       };
  //     }
  //     return {
  //       uri:
  //         MINDS_CDN_URI +
  //         'fs/v1/thumbnail/' +
  //         (this.attachment_guid || this.guid) +
  //         '/' +
  //         size,
  //       headers: api.buildHeaders(),
  //     };
  //   }
}

/**
 * Define model observables
 */
decorate(CommentModel, {
  replies_count: observable,
  description: observable,
  attachment_guid: observable,
  pinned: observable,
});
