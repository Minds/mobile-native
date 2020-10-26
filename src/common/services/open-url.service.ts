//@ts-nocheck
import { MINDS_URI, MINDS_PRO } from '../../config/Config';
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
    const navigatingToPro = url === MINDS_PRO;
    if (url.startsWith(MINDS_URI) && !navigatingToPro) {
      const routed = deeplinksRouterService.navigate(url);
      if (routed) return;
    }

    Linking.openURL(url);
  }
}

export default new OpenURLService();
