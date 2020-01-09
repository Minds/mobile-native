import { observable, action, runInAction } from 'mobx';
import { MINDS_CDN_URI, GOOGLE_PLAY_STORE } from '../config/Config';
import api from '../common/services/api.service';
import BaseModel from '../common/BaseModel';
import ChannelService from './ChannelService';
import sessionService from '../common/services/session.service';
import apiService from '../common/services/api.service';
import logService from '../common/services/log.service';

export const USER_MODE_OPEN = 0;
export const USER_MODE_MODERATED = 1;
export const USER_MODE_CLOSED = 2;

/**
 * User model
 */
export default class UserModel extends BaseModel {

  /**
   * @var {boolean}
   */
  @observable blocked;

  /**
   * @var {number}
   */
  @observable subscribers_count;

  /**
   * @var {number}
   */
  @observable impressions;

  /**
   * @var {boolean}
   */
  @observable subscribed;

  /**
   * @var {boolean}
   */
  @observable mature_visibility = false;

  /**
   * @var {boolean}
   */
  @observable pending_subscribe = false;

  /**
   * @var {numeric}
   */
  @observable mode = 0;

  /**
   * @var {boolean}
   */
  @observable email_confirmed = false;

  /**
   * Confirm email
   * @param {Object} params
   */
  confirmEmail = async params => {
    // call any api endpoint with the param
    try {
      await apiService.get('api/v2/entities/', { urn: this.urn, ...params });
      this.setEmailConfirmed(true);
      return true;
    } catch (error) {
      return false;
    }
  };

  getOwnerIcontime() {
    if (sessionService.getUser().guid === this.guid) {
      return sessionService.getUser().icontime;
    } else {
      return this.icontime;
    }
  }

  @action
  toggleMatureVisibility() {
    if (GOOGLE_PLAY_STORE) return;
    this.mature_visibility = !this.mature_visibility;
  }

  @action
  async toggleSubscription() {
    const value = !this.subscribed;
    this.subscribed = value;
    try {
      const metadata = this.getClientMetadata();
      await ChannelService.toggleSubscription(this.guid, value, metadata);
    } catch (err) {
      runInAction(() => {
        this.subscribed = !value;
      });
      throw err;
    }
  }

  @action
  async toggleBlock(value = null) {
    value = (value === null) ? !this.blocked : value;

    try {
      await ChannelService.toggleBlock(this.guid, value);
      this.blocked = value;
    } catch (err) {
      this.blocked = !value;
      logService.exception('[ChannelStore] toggleBlock', err);
    }
  }

  @action
  setMode(value) {
    this.mode = value;
  }

  @action
  setEmailConfirmed(value) {
    this.email_confirmed = value;
  }

  /**
   * Is admin
   */
  isAdmin() {
    return !!this.admin;
  }

  /**
   * current user is owner of the channel
   */
  isOwner = () => {
    return sessionService.getUser().guid === this.guid;
  }

  /**
   * Get banner source
   * @param {string} size
   */
  getBannerSource(size='medium') {
    if (this.carousels) {
      return {
        uri: this.carousels[0].src
      };
    }
    return { uri: `${MINDS_CDN_URI}fs/v1/banners/${this.guid}/fat/${this.icontime}`, headers: api.buildHeaders()};
  }

  /**
   * Get avatar source
   * @param {string} size
   */
  getAvatarSource(size='medium') {
    return { uri: `${MINDS_CDN_URI}icon/${this.guid}/${size}/${this.getOwnerIcontime()}`, headers: api.buildHeaders()};
  }

  /**
   * Has banner
   * @returns {boolean}
   */
  hasBanner() {
    return !!this.carousels;
  }

  /**
   * Is closed
   * @returns {boolean}
   */
  isClosed() {
    return this.mode === USER_MODE_CLOSED;
  }

  /**
   * Is open
   * @returns {boolean}
   */
  isOpen() {
    return this.mode === USER_MODE_OPEN;
  }

  /**
   * Is moderated
   * @returns {boolean}
   */
  isModerated() {
    return this.mode === USER_MODE_MODERATED;
  }

  /**
   * Is subscribed
   * @returns {boolean}
   */
  isSubscribed() {
    return !!this.subscribed;
  }

  /**
   * Request subscribe
   */
  async subscribeRequest() {
    if (this.pending_subscribe || this.mode !== USER_MODE_CLOSED) return;
    try {
      this.pending_subscribe = true;
      await apiService.put(`api/v2/subscriptions/outgoing/${this.guid}`);
    } catch (err) {
      this.pending_subscribe = false;
      logService.exception(err);
    }
  }

  /**
   * Cancel subscribe request
   */
  async cancelSubscribeRequest() {
    if (!this.pending_subscribe || this.mode !== USER_MODE_CLOSED) return;
    try {
      this.pending_subscribe = false;
      await apiService.delete(`api/v2/subscriptions/outgoing/${this.guid}`);
    } catch (err) {
      this.pending_subscribe = true;
      logService.exception(err);
    }
  }
}