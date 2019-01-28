import { computed, action, observable, decorate } from 'mobx';

import ActivityModel from '../newsfeed/ActivityModel';

/**
 * Comment model
 */
export default class CommentModel extends ActivityModel {

  @observable expanded = false;

  @action
  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}

/**
 * Define model observables
 */
decorate(CommentModel, {
  'replies_count': observable,
});