//@ts-nocheck
import { action, observable, decorate } from 'mobx';

import ActivityModel from '../newsfeed/ActivityModel';
import commentsStoreProvider from '../comments/CommentsStoreProvider';
import { MINDS_CDN_URI } from '../config/Config';

import api from '../common/services/api.service';

/**
 * Comment model
 */
export default class CommentModel extends ActivityModel {
  @observable expanded = false;
  entity_guid: string = '';
  focused?: boolean;
  attachments?: {
    attachment_guid: string;
  };

  /**
   * Store for child comments
   */
  comments = null;

  /**
   * The parent comment
   */
  parent = null;

  @action
  toggleExpanded() {
    this.expanded = !this.expanded;
    this.buildCommentsStore();
  }

  buildCommentsStore(parent) {
    if (this.expanded && !this.comments) {
      this.comments = commentsStoreProvider.get();
      this.comments.setParent(this);
      this.parent = parent;
    }
  }

  /**
   * Get the activity thumb source
   * {uri: 'http...'}
   * @param {string} size
   */
  getThumbSource(size = 'medium') {
    if (this.thumbnails && this.thumbnails[size]) {
      return { uri: this.thumbnails[size], headers: api.buildHeaders() };
    }
    // for gif use always the same size to take adventage of the cache (they are not resized)
    if (this.isGif()) size = 'medium';
    if (this.custom_type == 'batch') {
      return {
        uri:
          MINDS_CDN_URI +
          'fs/v1/thumbnail/' +
          (this.attachment_guid || this.entity_guid) +
          '/' +
          size,
      };
    }
    return {
      uri:
        MINDS_CDN_URI +
        'fs/v1/thumbnail/' +
        (this.attachment_guid || this.guid) +
        '/' +
        size,
    };
  }
}

/**
 * Define model observables
 */
decorate(CommentModel, {
  replies_count: observable,
});
