import { computed, action, observable, decorate } from 'mobx';

import FastImage from 'react-native-fast-image'
import BaseModel from '../common/BaseModel';
import UserModel from '../channel/UserModel';
import wireService from '../wire/WireService';
import { thumbActivity } from './activity/ActionsService';
import sessionService from '../common/services/session.service';
import { setPinPost } from '../newsfeed/NewsfeedService';

import {
  MINDS_CDN_URI
} from '../config/Config';

/**
 * Activity model
 */
export default class ActivityModel extends BaseModel {

  // add an extra observable properties
  @observable mature_visibility = false;

  /**
   * Is visible in flat list
   */
  @observable is_visible = true;

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

    if (this.get('remind_object.mature')) {
      this.remind_object.mature_visibility = this.mature_visibility;
    }
  }

  @action
  setVisible(value) {
    this.is_visible = value;
  }

  /**
   * Increment the comments counter
   */
  @action
  incrementCommentsCounter() {
    this['comments:count']++;
  }

  /**
   * Decrement the comments counter
   */
  @action
  decrementCommentsCounter() {
    this['comments:count']--;
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

  @action
  async togglePin() {

    // allow owners only
    if (!this.isOwner()) {
      return;
    }

    try {
      this.pinned = !this.pinned;
      const success = await setPinPost(this.guid, this.pinned);
    } catch(e) {
      this.pinned = !this.pinned;
      alert('Ooops, error setting pinned post');
    }
  }
}

/**
 * Define model observables
 */
decorate(ActivityModel, {
  'thumbs:down:count': observable,
  'thumbs:up:count': observable,
  'comments:count': observable,
  'paywall': observable,
  'mature': observable,
  'pinned': observable,
  'edited': observable,
  'thumbs:down:user_guids': observable,
  'thumbs:up:user_guids': observable
});
