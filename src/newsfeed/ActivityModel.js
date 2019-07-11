import { runInAction, action, observable, decorate, toJS } from 'mobx';

import FastImage from 'react-native-fast-image'
import BaseModel from '../common/BaseModel';
import UserModel from '../channel/UserModel';
import wireService from '../wire/WireService';
import { thumbActivity } from './activity/ActionsService';
import sessionService from '../common/services/session.service';
import { setPinPost, deleteItem, unfollow, follow, update } from '../newsfeed/NewsfeedService';
import api from '../common/services/api.service';

import {
  GOOGLE_PLAY_STORE,
  MINDS_CDN_URI,
  MINDS_URI
} from '../config/Config';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';

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
   *  List reference setter
   */
  set _list(value) {
    this.__list = value;

    // the reminded object need access to the metadata service too
    if (this.remind_object) {
      this.remind_object._list = value;
    }
  }

  /**
   *  List reference getter
   */
  get _list() {
    return this.__list;
  }


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
    // for gif use always the same size to take adventage of the cache (they are not resized)
    if (this.isGif()) size = 'medium';
    if (this.paywall || this.paywall_unlocked) {
      return { uri: MINDS_URI + 'fs/v1/thumbnail/' + this.entity_guid, headers: api.buildHeaders() };
    }
    if (this.custom_type == 'batch') {
      return { uri: MINDS_CDN_URI + 'fs/v1/thumbnail/' + this.entity_guid + '/' + size, headers: api.buildHeaders() };
    }
    return { uri: MINDS_CDN_URI + 'fs/v1/thumbnail/' + this.guid + '/' + size, headers: api.buildHeaders() };
  }

  isGif() {
    if (this.custom_data && this.custom_data[0] && this.custom_data[0].gif) return true;
    return false;
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

  shouldBeBlured() {

    const user = sessionService.getUser();

    if (user && user.mature) return false;

    if (typeof this.nsfw !== 'undefined') {
      let res = [ 1, 2, 4 ].filter(nsfw => this.nsfw.indexOf(nsfw) > -1).length;
      if (res) return true;
    }

    if (typeof this.flags !== 'undefined') {
      return !!this.flags.mature;
    }

    if (typeof this.mature !== 'undefined') {
      return !!this.mature;
    }

    if (typeof this.custom_data !== 'undefined' && typeof this.custom_data[0] !== 'undefined') {
      return !!this.custom_data[0].mature;
    }

    if (typeof this.custom_data !== 'undefined') {
      return !!this.custom_data.mature;
    }

    return false;
  }

  /**
   * Get activity text
   */
  get text() {
    return this.message || this.title || '';
  }

  @action
  toggleMatureVisibility() {
    if (GOOGLE_PLAY_STORE) return;
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
        // all changes should be atomic (trigger render only once)
        runInAction(() => {
          // create a new model because we need the child models
          const model = ActivityModel.create(result);
          Object.assign(this, model);
        });
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
      alert(i18n.t('errorPinnedPost'));
    }
  }

  @action
  async deleteEntity() {
    try {
      await deleteItem(this.guid)
      if (this._list) {
        runInAction(() => {
          this._list.remove(this);
        });
      }
    } catch (err) {
      logService.exception('[ActivityModel]', err);
      throw err;
    }
  }

  @action
  async toggleFollow() {
    const method = this['is:following'] ? unfollow : follow;
    try {
      await method(this.guid)
      runInAction(() => {
        this['is:following'] = !this['is:following'];
      });
    } catch (err) {
      logService.exception('[OffsetFeedListStore]', err);
      throw err;
    }
  }

  @action
  async updateActivity(data = {}) {
    const list = this._list;
    delete(this._list);
    const entity = toJS(this);
    this._list = list;

    if (data) {
      for (const field in data) {
        entity[field] = data[field];
      }
    }

    await update(entity);
    this.setEdited(entity.message);
  }

  @action
  setEdited(message) {
    this.message = message
    this.edited  = 1;
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
  'message': observable,
  'thumbs:down:user_guids': observable,
  'thumbs:up:user_guids': observable
});
