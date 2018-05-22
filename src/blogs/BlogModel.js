import { MINDS_ASSETS_CDN_URI } from '../config/Config';
import api from '../common/services/api.service';
import BaseModel from '../common/BaseModel';
import UserModel from '../channel/UserModel';

import { LICENSES } from '../common/services/list-options.service';
/**
 * User model
 */
export default class BlogModel extends BaseModel {

  /**
   * observables
   */
  static observables = [
    'thumbs:down:count',
    'thumbs:up:count',
  ]

  /**
   * shallow observables
   */
  static observablesShallow = [
    'thumbs:down:user_guids',
    'thumbs:up:user_guids',
  ]

  /**
   * Get banner source
   * @param {string} size
   */
  getBannerSource(size='medium') {
    const uri = (this.thumbnail_src && this.thumbnail_src != 'https://cdn.minds.com/thumbProxy?src=&c=2708')?
      this.thumbnail_src:
      `${MINDS_ASSETS_CDN_URI}front/dist/assets/logos/placeholder-bulb.jpg`;

    return { uri, headers: api.buildHeaders()};
  }

  /**
   * Child models
   */
  childModels() {
    return {
      ownerObj: UserModel
    }
  }

  /**
   * Get the license text
   */
  getLicenseText() {
    const lic =  LICENSES.find(license => this.license == license.value);
    if (!lic) return;
    return lic.text;
  }
}