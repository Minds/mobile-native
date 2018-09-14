import { observable } from 'mobx';
import { MINDS_CDN_URI } from '../config/Config';
import api from '../common/services/api.service';
import BaseModel from '../common/BaseModel';
import stores from '../../AppStores';

/**
 * User model
 */
export default class UserModel extends BaseModel {

  /**
   * @var boolean
   */
  @observable blocked;
  /**
   * @var boolean
   */
  @observable subscribed;

  getOwnerIcontime() {
    if (stores.user.me && stores.user.me.guid === this.guid) {
      return stores.user.me.icontime;
    } else {
      return this.icontime;
    }
  }

  /**
   * current user is owner of the channel
   */
  isOwner() {
    return stores.user.me.guid === this.guid;
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