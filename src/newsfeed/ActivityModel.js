import { computed, action } from 'mobx';

import BaseModel from '../common/BaseModel';
import SessionService from '../common/services/session.service';
import { thumbActivity } from './activity/ActionsService';

/**
 * Activity model
 */
export default class ActivityModel extends BaseModel {

  /**
   * observables
   */
  static observables = [
    'thumbs:down:count',
    'thumbs:up:count',
  ]

  /**
   * shallow observables
   */
  static observablesShallow = [
    'thumbs:down:user_guids',
    'thumbs:up:user_guids',
  ]

  /**
   * Child models
   */
  childModels() {
    return {
      remind_object: ActivityModel
    }
  }

  /**
   * voted up
   */
  @computed
  get votedUp() {
    if (this['thumbs:up:user_guids'] && this['thumbs:up:user_guids'].indexOf(SessionService.guid) >= 0) {
      return true;
    }
    return false;
  }

  /**
   * voted down
   */
  @computed
  get votedDown() {
    if (this['thumbs:down:user_guids'] && this['thumbs:down:user_guids'].indexOf(SessionService.guid) >= 0) {
      return true;
    }
    return false;
  }

  /**
   * Toggle vote
   * @param {string} direction
   */
  @action
  toggleVote(direction) {

    const voted = (direction == 'up') ? this.votedUp : this.votedDown;
    const delta = (voted) ? -1 : 1;

    const guids = this['thumbs:' + direction + ':user_guids'];

    if (voted) {
      this['thumbs:' + direction + ':user_guids'] = guids.filter(function (item) {
        return item !== SessionService.guid
      })
    } else {
      this['thumbs:' + direction + ':user_guids'] = [SessionService.guid, ...guids]
    }

    this['thumbs:' + direction + ':count'] += delta;

    // class service
    thumbActivity(this.guid, direction).then((data) => { }).catch(err => {
      alert(err);
      if (!voted) {
        this['thumbs:' + direction + ':user_guids'] = guids.filter(function (item) {
          return item !== SessionService.guid
        })
      } else {
        this['thumbs:' + direction + ':user_guids'] = [SessionService.guid, ...guids]
      }
      this['thumbs:' + direction + ':count'] -= delta;
    })
  }
}