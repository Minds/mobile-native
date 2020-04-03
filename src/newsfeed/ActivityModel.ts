import { runInAction, action, observable, decorate } from 'mobx';
import FastImage from 'react-native-fast-image';
import { FlatList, Alert } from 'react-native';

import BaseModel from '../common/BaseModel';
import UserModel from '../channel/UserModel';
import wireService from '../wire/WireService';
import sessionService from '../common/services/session.service';
import {
  setPinPost,
  deleteItem,
  unfollow,
  follow,
  update,
} from '../newsfeed/NewsfeedService';
import api from '../common/services/api.service';

import { GOOGLE_PLAY_STORE, MINDS_CDN_URI, MINDS_URI } from '../config/Config';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import entitiesService from '../common/services/entities.service';
import type { ThumbSize } from '../types/Common';
import type GroupModel from 'src/groups/GroupModel';

type Thumbs = Record<ThumbSize, string>;

/**
 * Activity model
 */
export default class ActivityModel extends BaseModel {
  // Observable properties
  @observable pinned: boolean = false;
  @observable time_created: string = '';
  @observable message: string = '';
  @observable title: string = '';
  @observable mature: boolean = false;
  @observable edited: '0' | '1' = '0';

  // decorated observables
  'is:following': boolean;
  'thumbs:down:count': number;
  'thumbs:up:count': number;
  'comments:count': number;
  'thumbs:down:user_guids': Array<number>;
  'thumbs:up:user_guids': Array<number>;

  containerObj?: GroupModel;
  remind_object?: ActivityModel;
  ownerObj!: UserModel;
  listRef?: FlatList<any>;
  thumbnails?: Thumbs;
  paywall: '1' | '' = '';
  paywall_unlocked: boolean = false;
  guid: string = '';
  subtype: string = '';
  entity_guid: string = '';
  owner_guid: string = '';
  custom_type?: string;
  custom_data?: Array<any> | any;
  nsfw?: Array<number>;
  flags?: any;
  reminds: number = 0;
  impressions: number = 0;
  perma_url?: string;
  cinemr_guid?: string;
  thumbnail_src?: string;
  dontPin?: boolean;
  boosted?: boolean;
  wire_threshold?: {
    type: 'token' | 'money';
    min: number;
  } | null;
  _preview?: boolean;
  /**
   * Set programatically to indicate that the parent is marked as mature
   */
  is_parent_mature?: boolean;

  /**
   * Mature visibility flag
   */
  @observable mature_visibility: boolean = false;

  /**
   * Is visible in flat list
   */
  @observable is_visible: boolean = true;

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

  toPlainObject() {
    const plainEntity = super.toPlainObject();
    if (plainEntity.remind_object && plainEntity.remind_object.__list) {
      delete plainEntity.remind_object.__list;
    }

    return plainEntity;
  }

  /**
   * Child models
   */
  childModels() {
    return {
      ownerObj: UserModel,
      remind_object: ActivityModel,
    };
  }

  /**
   * Get the activity thumb source
   * {uri: 'http...'}
   * @param {string} size
   */
  getThumbSource(size: ThumbSize = 'medium') {
    // for gif use always the same size to take adventage of the cache (they are not resized)
    if (this.isGif()) {
      size = 'medium';
    }

    if (this.thumbnails && this.thumbnails[size]) {
      return { uri: this.thumbnails[size], headers: api.buildHeaders() };
    }

    // fallback to old behavior
    if (this.paywall || this.paywall_unlocked) {
      return {
        uri: MINDS_URI + 'fs/v1/thumbnail/' + this.entity_guid,
        headers: api.buildHeaders(),
      };
    }
    if (this.custom_type === 'batch') {
      return {
        uri: MINDS_CDN_URI + 'fs/v1/thumbnail/' + this.entity_guid + '/' + size,
        headers: api.buildHeaders(),
      };
    }
    return {
      uri: MINDS_CDN_URI + 'fs/v1/thumbnail/' + this.guid + '/' + size,
      headers: api.buildHeaders(),
    };
  }

  isGif(): boolean {
    return this.custom_data && this.custom_data[0] && this.custom_data[0].gif;
  }

  /**
   * Preload thumb on image cache
   */
  preloadThumb(size: ThumbSize = 'medium') {
    FastImage.preload([this.getThumbSource(size)]);
  }

  shouldBeBlured(): boolean {
    const user = sessionService.getUser();

    if (user && user.mature) {
      return false;
    }

    if (this.nsfw !== undefined) {
      let res = [1, 2, 4].filter((nsfw) => this.nsfw!.indexOf(nsfw) > -1)
        .length;
      if (res) {
        return true;
      }
    }

    if (typeof this.flags !== 'undefined') {
      return !!this.flags.mature;
    }

    if (typeof this.mature !== 'undefined') {
      return !!this.mature;
    }

    if (
      typeof this.custom_data !== 'undefined' &&
      typeof this.custom_data[0] !== 'undefined'
    ) {
      return !!this.custom_data[0].mature;
    }

    if (this.custom_data !== undefined) {
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
    if (GOOGLE_PLAY_STORE) {
      return;
    }
    this.mature_visibility = !this.mature_visibility;

    if (this.remind_object && this.remind_object.mature) {
      this.remind_object.mature_visibility = this.mature_visibility;
    }
  }

  @action
  setVisible(value: boolean) {
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
  async unlock(ignoreError = false) {
    try {
      const result: object | false = await wireService.unlock(this.guid);
      if (result) {
        // all changes should be atomic (trigger render only once)
        runInAction(() => {
          // create a new model because we need the child models
          const model: ActivityModel = ActivityModel.create(result);
          Object.assign(this, model);
        });
      }
      return result;
    } catch (err) {
      if (!ignoreError) {
        Alert.alert(err.message);
      }
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
      await setPinPost(this.guid, this.pinned);
    } catch (e) {
      this.pinned = !this.pinned;
      Alert.alert(i18n.t('errorPinnedPost'));
    }
  }

  @action
  async deleteEntity() {
    try {
      await deleteItem(this.guid);
      this.removeFromList();
      entitiesService.deleteFromCache(this.urn);
    } catch (err) {
      logService.exception('[ActivityModel]', err);
      throw err;
    }
  }

  @action
  async toggleFollow() {
    const method = this['is:following'] ? unfollow : follow;
    try {
      await method(this.guid);
      runInAction(() => {
        this['is:following'] = !this['is:following'];
      });
    } catch (err) {
      logService.exception('[OffsetFeedListStore]', err);
      throw err;
    }
  }

  @action
  async updateActivity(data: any = {}) {
    const entity: any = this.toPlainObject();

    if (data) {
      for (const field in data) {
        entity[field] = data[field];
      }
    }

    // call update endpoint
    await update(entity);

    // update instance properties
    this.update(data);

    this.setEdited(entity.message);
  }

  @action
  setEdited(message: string) {
    this.message = message;
    this.edited = '1';
  }
}

/**
 * Define model observables
 */
decorate(ActivityModel, {
  //@ts-ignore
  'thumbs:down:count': observable,
  'thumbs:up:count': observable,
  'comments:count': observable,
  'thumbs:down:user_guids': observable,
  'thumbs:up:user_guids': observable,
});
