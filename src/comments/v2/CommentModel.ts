import { observable, decorate } from 'mobx';

import ActivityModel from '../../newsfeed/ActivityModel';
import CommentsStore from '~/comments/v2/CommentsStore';

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
  store?: CommentsStore;
}

/**
 * Define model observables
 */
decorate(CommentModel, {
  replies_count: observable,
  description: observable,
  attachment_guid: observable,
});
