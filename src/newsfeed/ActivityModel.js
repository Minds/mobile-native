import { computed, action } from 'mobx';

import BaseModel from '../common/BaseModel';
import sessionService from '../common/services/session.service';
import { thumbActivity } from './activity/ActionsService';
import wireService from '../wire/WireService';

import UserModel from '../channel/UserModel';
import FastImage from 'react-native-fast-image'

import {
  MINDS_CDN_URI
} from '../config/Config';


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
    'paywall',
    'mature',
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
      ownerObj: UserModel,
      remind_object: ActivityModel
    }
  }

  /**
   * Get the activity thumb source
   * {uri: 'http...'}
   * @param {string} size
   */
  getThumbSource(size = 'medium') {
    return { uri: MINDS_CDN_URI + 'api/v1/archive/thumbnails/' + this.guid + '/' + size };
  }

  /**
   * Preload thumb on image cache
   */
  preloadThumb(size = 'medium') {
    FastImage.preload([this.getThumbSource(size)]);
  }

  /**
   * voted up
   */
  @computed
  get votedUp() {
    if (
      this['thumbs:up:user_guids']
      && this['thumbs:up:user_guids'].length
      && this['thumbs:up:user_guids'].indexOf(sessionService.guid) >= 0
    ) {
      return true;
    }
    return false;
  }

  /**
   * voted down
   */
  @computed
  get votedDown() {
    if (
      this['thumbs:down:user_guids']
      && this['thumbs:down:user_guids'].length
      && this['thumbs:down:user_guids'].indexOf(sessionService.guid) >= 0
    ) {
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
        return item !== sessionService.guid
      })
    } else {
      this['thumbs:' + direction + ':user_guids'] = [sessionService.guid, ...guids]
    }

    this['thumbs:' + direction + ':count'] += delta;
    // class service
    thumbActivity(this.guid, direction).then((data) => { }).catch(err => {
      alert(err);
      if (!voted) {
        this['thumbs:' + direction + ':user_guids'] = guids.filter(function (item) {
          return item !== sessionService.guid
        })
      } else {
        this['thumbs:' + direction + ':user_guids'] = [sessionService.guid, ...guids]
      }
      this['thumbs:' + direction + ':count'] -= delta;
    })
  }

  /**
   * Return if the current user is the owner of the activity
   */
  isOwner() {
    return sessionService.guid == this.ownerObj.guid;
  }

  /**
   * Get activity text
   */
  get text() {
    return this.message || this.title || '';
  }

  /**
   * Unlock the activity and update data on success
   */
  @action
  async unlock(ignoreError=false) {
    try {
      result = await wireService.unlock(this.guid);
      if (result) {
        // create a new model because we need the child models
        const model = ActivityModel.create(result);
        Object.assign(this, model);
      }
      return true;
    } catch(err) {
      if (!ignoreError) alert(err.message);
      return false;
    }
  }
}