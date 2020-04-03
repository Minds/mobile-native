//@ts-nocheck
import { MINDS_URI } from '../../config/Config';
import { Linking } from 'react-native';
import deeplinksRouterService from './deeplinks-router.service';

/**
 * Open url service
 */
class OpenURLService {

  /**
   * Open url
   * @param {string} url
   */
  open(url) {
    if (url.startsWith(MINDS_URI)) {
      const routed = deeplinksRouterService.navigate(url);
      if (routed) return;
    }

    Linking.openURL(url);
  }
}

export default new OpenURLService();