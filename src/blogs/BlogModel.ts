import { ImageURISource } from 'react-native';
import { decorate, observable, action } from 'mobx';
import { MINDS_ASSETS_CDN_URI } from '../config/Config';
import api from '../common/services/api.service';
import BaseModel from '../common/BaseModel';
import UserModel from '../channel/UserModel';
import { LICENSES } from '../common/services/list-options.service';

/**
 * User model
 */
export default class BlogModel extends BaseModel {
  subtype?: string;
  thumbnail_src?: string;
  license: string = '';
  owner_guid: string = '';
  reminds: number = 0;
  impressions: number = 0;
  'thumbs:down:count': number;
  'thumbs:up:count': number;
  'comments:count': number;
  'thumbs:down:user_guids': Array<number>;
  'thumbs:up:user_guids': Array<number>;

  /**
   * Get banner source
   */
  getBannerSource(): ImageURISource {
    const uri =
      this.thumbnail_src &&
      this.thumbnail_src !== 'https://cdn.minds.com/thumbProxy?src=&c=2708'
        ? this.thumbnail_src
        : `${MINDS_ASSETS_CDN_URI}front/dist/assets/logos/placeholder-bulb.jpg`;

    return { uri, headers: api.buildHeaders() };
  }

  /**
   * Child models
   */
  childModels() {
    return {
      ownerObj: UserModel,
    };
  }

  /**
   * Get the license text
   */
  getLicenseText(): string {
    const lic = LICENSES.find((license) => this.license === license.value);
    if (!lic) {
      return '';
    }
    return lic.text;
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
}

/**
 * Define model observables
 */
//@ts-ignore
decorate(BlogModel, {
  'thumbs:down:count': observable,
  'thumbs:up:count': observable,
  'thumbs:down:user_guids': observable,
  'thumbs:up:user_guids': observable,
  description: observable,
});
