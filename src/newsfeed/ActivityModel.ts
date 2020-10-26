import { runInAction, action, observable, decorate } from 'mobx';
import FastImage from 'react-native-fast-image';
import { FlatList, Alert, Platform } from 'react-native';

import BaseModel from '../common/BaseModel';
import UserModel from '../channel/UserModel';
import wireService from '../wire/WireService';
import sessionService from '../common/services/session.service';
import {
  setPinPost,
  deleteItem,
  unfollow,
  follow,
} from '../newsfeed/NewsfeedService';
import api from '../common/services/api.service';

import { GOOGLE_PLAY_STORE, MINDS_CDN_URI, MINDS_URI } from '../config/Config';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import entitiesService from '../common/services/entities.service';
import type { ThumbSize, LockType } from '../types/Common';
import type GroupModel from '../groups/GroupModel';
import { SupportTiersType } from '../wire/WireTypes';
import mindsService from '../common/services/minds.service';
import NavigationService from '../navigation/NavigationService';

type Thumbs = Record<ThumbSize, string> | Record<ThumbSize, string>[];

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
  @observable paywall: true | '1' | '' = '';

  // decorated observables
  'is:following': boolean;
  'thumbs:down:count': number;
  'thumbs:up:count': number;
  'comments:count': number;
  'thumbs:down:user_guids': Array<number>;
  'thumbs:up:user_guids': Array<number>;
  seen?: boolean;
  rowKey?: string;
  description?: string; // on image objects in some cases the message is on description field
  containerObj?: GroupModel;
  remind_object?: ActivityModel;
  ownerObj!: UserModel;
  listRef?: FlatList<any>;
  thumbnails?: Thumbs;
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
  wire_threshold?:
    | {
        type: 'token' | 'money';
        min: number;
      }
    | { support_tier: SupportTiersType }
    | null;
  _preview?: boolean;
  attachments?: {
    attachment_guid: string;
  };

  permaweb_id?: string;

  /**
   * Mature visibility flag
   */
  @observable mature_visibility: boolean = false;

  /**
   * Is visible in flat list
   */
  @observable is_visible: boolean = false;

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
   * Block owner
   */
  async blockOwner() {
    await super.blockOwner();
    if (this._list) {
      this._list.refresh();
    }
  }

  /**
   * Unblock owner
   */
  async unblockOwner() {
    await super.unblockOwner();
    if (this._list) {
      this._list.refresh();
    }
  }

  /**
   * Has media
   */
  hasMedia(): boolean {
    const type = this.custom_type || this.subtype;
    switch (type) {
      case 'image':
      case 'video':
      case 'batch':
        return true;
    }
    if (this.perma_url) {
      return true;
    }
    return false;
  }

  /**
   * Has an attached video
   */
  hasVideo(): boolean {
    return (this.custom_type || this.subtype) === 'video';
  }

  /**
   * Has an attached image
   */
  hasImage(): boolean {
    const type = this.custom_type || this.subtype;
    return type === 'image' || type === 'batch';
  }

  hasThumbnails(): boolean {
    return Array.isArray(this.thumbnails) && this.thumbnails.length === 0
      ? false
      : this.thumbnails
      ? true
      : false;
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
    // for gif use always the same size to take advantage of the cache (they are not resized)
    if (this.isGif()) {
      size = 'xlarge';
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
    return this.message || this.description || '';
  }

  @action
  toggleMatureVisibility() {
    if (GOOGLE_PLAY_STORE || Platform.OS === 'ios') {
      return;
    }
    this.mature_visibility = !this.mature_visibility;

    if (this.remind_object && this.remind_object) {
      this.remind_object.mature_visibility = this.mature_visibility;
    }
  }

  @action
  setVisible(value: boolean) {
    this.is_visible = value;
    if (this.remind_object) {
      this.remind_object.is_visible = value;
    }
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
          const list = this.__list;
          const model: ActivityModel = ActivityModel.create(result);
          Object.assign(this, model);
          this.__list = list;
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

  /**
   * Get the lock type for the activity
   */
  getLockType = (): LockType | undefined => {
    const support_tier: SupportTiersType | null =
      this.wire_threshold && 'support_tier' in this.wire_threshold
        ? this.wire_threshold.support_tier
        : null;
    if (!support_tier) {
      return;
    }
    let type: LockType = support_tier.public ? 'members' : 'paywall';

    if (mindsService.settings.plus.support_tier_urn === support_tier.urn) {
      type = 'plus';
    }

    return type;
  };

  /**
   * Unlock the entity or prompt pay options
   */
  async unlockOrPay() {
    const result = await this.unlock(true);

    if (result) {
      return;
    }

    const lockType = this.getLockType();

    const support_tier: SupportTiersType | null =
      this.wire_threshold && 'support_tier' in this.wire_threshold
        ? this.wire_threshold.support_tier
        : null;

    switch (lockType) {
      case 'plus':
        NavigationService.push('PlusScreen', {
          support_tier,
          entity: this,
          onComplete: (resultComplete: any) => {
            if (resultComplete && resultComplete.payload.method === 'onchain') {
              setTimeout(() => {
                Alert.alert(
                  i18n.t('wire.weHaveReceivedYourTransaction'),
                  i18n.t('wire.pleaseTryUnlockingMessage'),
                );
              }, 400);
            } else {
              this.unlock();
            }
          },
        });
        break;
      case 'members':
      case 'paywall':
        NavigationService.push('JoinMembershipScreen', {
          entity: this,
          onComplete: (resultComplete: any) => {
            if (resultComplete && resultComplete.payload.method === 'onchain') {
              setTimeout(() => {
                Alert.alert(
                  i18n.t('wire.weHaveReceivedYourTransaction'),
                  i18n.t('wire.pleaseTryUnlockingMessage'),
                );
              }, 400);
            } else {
              this.unlock();
            }
          },
        });
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
  setEdited(value) {
    this.edited = value;
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
