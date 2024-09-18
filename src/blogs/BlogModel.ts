import { ImageURISource } from 'react-native';
import { decorate, observable } from 'mobx';
import { MINDS_ASSETS_CDN_URI } from '../config/Config';
import { LICENSES } from '../common/services/list-options.service';
import ActivityModel from '../newsfeed/ActivityModel';
import serviceProvider from '~/services/serviceProvider';

/**
 * User model
 */
export default class BlogModel extends ActivityModel {
  license: string = '';
  slug: string = '';

  /**
   * Get banner source
   */
  getBannerSource(): ImageURISource {
    const uri =
      this.thumbnail_src &&
      this.thumbnail_src !== 'https://cdn.minds.com/thumbProxy?src=&c=2708'
        ? this.thumbnail_src
        : `${MINDS_ASSETS_CDN_URI}front/dist/assets/logos/placeholder-bulb.jpg`;

    return { uri, headers: serviceProvider.api.buildHeaders() };
  }

  /**
   * Get the license text
   */
  getLicenseText(): string {
    const lic = LICENSES.find(license => this.license === license.value);
    if (!lic) {
      return '';
    }
    return lic.text;
  }
}

/**
 * Define model observables
 */
//@ts-ignore
decorate(BlogModel, {
  description: observable,
});
