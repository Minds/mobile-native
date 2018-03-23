import { MINDS_CDN_URI } from '../config/Config';
import api from '../common/services/api.service';
import BaseModel from '../common/BaseModel';
import UserStore from '../auth/UserStore';

/**
 * User model
 */
export default class UserModel extends BaseModel {

  getOwnerIcontime() {
    if(UserStore.me && UserStore.me.guid === this.guid) {
      return UserStore.me.icontime;
    } else {
      return this.guid;
    }
  }

  /**
   * current user is owner of the channel
   */
  isOwner() {
    return UserStore.me.guid === this.guid;
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

  /**
   * observables
   */
  static observables = [
    'blocked',
    'subscribed',
  ]
}