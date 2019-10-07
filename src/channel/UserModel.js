import { observable, action, runInAction } from 'mobx';
import { MINDS_CDN_URI, GOOGLE_PLAY_STORE } from '../config/Config';
import api from '../common/services/api.service';
import BaseModel from '../common/BaseModel';
import ChannelService from './ChannelService';
import sessionService from '../common/services/session.service';


/**
 * User model
 */
export default class UserModel extends BaseModel {

  /**
   * @var boolean
   */
  @observable blocked;

  /**
   * @var integer
   */
  @observable subscribers_count;

  /**
   * @var integer
   */
  @observable impressions;

  /**
   * @var boolean
   */
  @observable subscribed;
  /**
   * @var boolean
   */
  @observable mature_visibility = false;

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

  /**
   * current user is owner of the channel
   */
  isOwner() {
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
   */
  hasBanner() {
    return !!this.carousels;
  }
}