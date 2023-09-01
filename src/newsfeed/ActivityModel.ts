import { runInAction, action, observable, decorate } from 'mobx';
import { FlatList, Alert, Platform } from 'react-native';
import _ from 'lodash';
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
import api, {
  isApiError,
  isNetworkError,
} from '../common/services/api.service';

import { GOOGLE_PLAY_STORE, MINDS_CDN_URI, MINDS_URI } from '../config/Config';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import type { ThumbSize, LockType } from '../types/Common';
import GroupModel from '../groups/GroupModel';
import { SupportTiersType } from '../wire/WireTypes';
import mindsService from '../common/services/minds-config.service';
import NavigationService from '../navigation/NavigationService';
import { showNotification } from '../../AppMessages';
import mediaProxyUrl from '../common/helpers/media-proxy-url';
import socketService from '~/common/services/socket.service';
import { hasVariation } from '../../ExperimentsProvider';
import { Image, ImageSource } from 'expo-image';
import { BoostButtonText } from '../modules/boost/boost-composer/boost.store';

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

  supermind?: {
    request_guid: string;
    is_reply: boolean;
    receiver_user?: UserModel;
  };

  time_updated: string = '';
  // decorated observables
  'is:following': boolean;
  'thumbs:down:count': number;
  'thumbs:up:count': number;
  'comments:count': number;
  'thumbs:down:user_guids': Array<string>;
  'thumbs:up:user_guids': Array<string>;
  seen?: boolean;
  rowKey?: string;
  boosted_guid?: string;
  description?: string; // on image objects in some cases the message is on description field
  containerObj?: GroupModel;
  remind_object?: ActivityModel;
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
  quotes: number = 0;
  impressions: number = 0;
  perma_url?: string;
  cinemr_guid?: string;
  thumbnail_src?: string;
  dontPin?: boolean;
  boosted?: boolean;
  wire_threshold?: {
    type: 'token' | 'money';
    min: number;
    support_tier: SupportTiersType;
  } | null;
  _preview?: boolean;
  attachments?: {
    attachment_guid: string;
    custom_data: any;
    custom_type: string;
  };
  spam?: boolean;
  type?: string;
  remind_deleted?: boolean;
  remind_users?: Array<UserModel>;
  blurhash?: string;
  blurb?: string;
  container_guid?: string;
  tags?: string[];

  /**
   * Goals
   */
  goal_button_text?: BoostButtonText;
  goal_button_url?: string;

  canonical_url?: string;

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
    if (this.perma_url && this.thumbnail_src) {
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
      plainEntity.remind_object.__list = null;
    }

    return plainEntity;
  }

  /**
   * Child models
   */
  childModels(): any {
    return {
      ownerObj: UserModel,
      containerObj: GroupModel,
      remind_object: ActivityModel,
    };
  }

  /**
   * Get the activity thumb source
   * {uri: 'http...'}
   * @param {string} size
   */
  getThumbSource(size: ThumbSize = 'medium'): ImageSource {
    // for gif use always the same size to take advantage of the cache (they are not resized)
    if (this.isGif()) {
      size = 'xlarge';
    }

    if (this.perma_url) {
      return {
        uri:
          this.type === 'comment'
            ? this.thumbnail_src
            : mediaProxyUrl(this.thumbnail_src),
        headers: api.buildHeaders(),
      };
    }

    if (
      this.type === 'object' &&
      this.subtype === 'image' &&
      this.thumbnail_src
    ) {
      return {
        uri: this.thumbnail_src,
        headers: api.buildHeaders(),
      };
    }

    if (this.thumbnails && this.thumbnails[size]) {
      return { uri: this.thumbnails[size], headers: api.buildHeaders() };
    }

    // fallback to old behavior
    if (this.paywall || this.paywall_unlocked) {
      const guid = this.entity_guid === '' ? this.guid : this.entity_guid;
      const unlock = this.isOwner() ? '?unlock_paywall=1' : '';
      return {
        uri: MINDS_URI + 'fs/v1/thumbnail/' + guid + unlock,
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
    const uri = this.getThumbSource(size)?.uri;
    uri && Image.prefetch(uri);
  }

  shouldBeBlured(): boolean {
    const user = sessionService.getUser();

    if (user && user.mature) {
      return false;
    }

    if (this.nsfw !== undefined) {
      let res = [1, 2, 4].filter(nsfw => this.nsfw!.indexOf(nsfw) > -1).length;
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
  toggleMatureVisibility = () => {
    if (GOOGLE_PLAY_STORE || Platform.OS === 'ios') {
      showNotification(i18n.t('activity.notSafeComment'));
      return;
    }
    this.mature_visibility = !this.mature_visibility;

    if (this.remind_object && this.remind_object) {
      this.remind_object.mature_visibility = this.mature_visibility;
    }
  };

  @action
  setVisible(visible: boolean) {
    this.is_visible = visible;
    if (this.remind_object) {
      this.remind_object.is_visible = visible;
    }

    if (hasVariation('mob-4424-sockets')) {
      if (visible) {
        this.listenForMetricsDebounced();
      } else {
        this.unlistenFromMetrics();
      }
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

      if (
        this.entity_guid &&
        this.perma_url &&
        this.perma_url?.startsWith(MINDS_URI)
      ) {
        NavigationService.push('BlogView', {
          guid: this.entity_guid,
          unlock: true,
        });
      }

      return result;
    } catch (err) {
      const isApiErr = isApiError(err);

      if (isApiErr && !ignoreError) {
        showNotification(err.message, 'warning', 3000);
      }

      if (isApiErr) {
        return false;
      }

      if (isNetworkError(err)) {
        showNotification(i18n.t('cantReachServer'), 'warning', 3000);
      }

      return -1;
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

    if (result !== false) {
      return;
    }

    const lockType = this.getLockType();

    const support_tier: SupportTiersType | null =
      this.wire_threshold && 'support_tier' in this.wire_threshold
        ? this.wire_threshold.support_tier
        : null;

    switch (lockType) {
      case 'plus':
        NavigationService.push('UpgradeScreen', {
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
      ActivityModel.events.emit('deleteEntity', this);
    } catch (err) {
      logService.exception('[ActivityModel]', err);
      throw err;
    }
  }

  async deleteRemind() {
    try {
      await api.delete(`api/v3/newsfeed/${this.urn}`);
      this.removeFromList();
      ActivityModel.events.emit('deleteEntity', this);
    } catch (err) {
      logService.exception('[ActivityModel]', err);
      throw err;
    }
  }

  @action
  async hideEntity() {
    try {
      await api.put(`api/v3/newsfeed/hide-entities/${this.guid}`);
      this.removeFromList();
      ActivityModel.events.emit('hideEntity', this);
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
      logService.exception('[ActivityModel]', err);
      throw err;
    }
  }

  @action
  setEdited(value) {
    this.edited = value;
  }

  /**
   * whether the entity is locked
   */
  isLocked() {
    if (this.isOwner() || this.hasVideo() || !this.paywall) {
      return false;
    }

    const wire_threshold = this.wire_threshold;
    const support_tier: SupportTiersType | null =
      wire_threshold && 'support_tier' in wire_threshold
        ? wire_threshold.support_tier
        : null;

    if (support_tier) {
      return true;
    } else {
      if (wire_threshold && wire_threshold.min) {
        return true;
      }
    }

    return false;
  }

  private get metricsRoom() {
    return `entity:metrics:${this.entity_guid || this.guid}`;
  }

  private onMetricsUpdate(event: string) {
    logService.log('[ActivityModel] metrics update', event);

    try {
      const metricsEvent: MetricsChangedEvent = JSON.parse(event);

      runInAction(() => {
        if (typeof metricsEvent['thumbs:up:count'] === 'number') {
          this['thumbs:up:count'] = metricsEvent['thumbs:up:count'];
        }
        if (typeof metricsEvent['thumbs:down:count'] === 'number') {
          this['thumbs:down:count'] = metricsEvent['thumbs:down:count'];
        }
      });
    } catch (e) {
      logService.error(e, event);
      return;
    }
  }

  /**
   * listens to metrics updates with 1000ms debounce time
   */
  private listenForMetricsDebounced = _.debounce(this.listenForMetrics, 1000);

  /**
   * listens to metrics updates
   */
  private listenForMetrics(): void {
    socketService.join(this.metricsRoom);
    socketService.subscribe(this.metricsRoom, event =>
      this.onMetricsUpdate(event),
    );
  }

  /**
   * unlistens from metrics updates
   */
  private unlistenFromMetrics(): void {
    this.listenForMetricsDebounced.cancel();
    socketService.leave(this.metricsRoom);
    socketService.unsubscribe(this.metricsRoom, event =>
      this.onMetricsUpdate(event),
    );
  }

  /**
   * Used to handle the state for the collapsed state
   */
  @action
  setCollapsed(on = true) {
    this._collapsed = on;
    this.__list?.updateEntity(this.guid, this);
  }

  /**
   * returns external data such as mastodon handle and source
   */
  getExternalData() {
    if (!this.source) {
      return undefined;
    }

    const [handle, source] = this.ownerObj.username.split('@');

    if (!handle || !source) {
      return undefined;
    }

    return {
      handle,
      source,
    };
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

// Parsed metrics changed event.
type MetricsChangedEvent = {
  'thumbs:up:count'?: number;
  'thumbs:down:count'?: number;
};
