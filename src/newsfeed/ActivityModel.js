import { computed, action, observable } from 'mobx';

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

  // add an extra observable property
  @observable mature_visibility = false;

  /**
   * observables
   */
  static observables = [
    'thumbs:down:count',
    'thumbs:up:count',
    'paywall',
    'mature',
    'edited'
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

  @action
  toggleMatureVisibility() {
    this.mature_visibility = !this.mature_visibility;
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
      return result;
    } catch(err) {
      if (!ignoreError) alert(err.message);
      return false;
    }
  }
}