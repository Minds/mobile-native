import { APP_URI, MINDS_PRO } from '../../config/Config';
import { Linking } from 'react-native';

import type { Storages } from './storage/storages.service';
import type { NavigationService } from '~/navigation/NavigationService';
import type { DeepLinksRouterService } from './deeplinks-router.service';
import { openLinkInInAppBrowser } from './inapp-browser.service';

const STORAGE_NAMESPACE = 'openLinksBrowser';

type BrowserType = 0 | 1; // not defined, 0 in app, 1 default browser

/**
 * Open url service
 */
export class OpenURLService {
  preferredBrowser?: BrowserType = undefined;

  constructor(
    private storages: Storages,
    private navigation: NavigationService,
    private deeplink: DeepLinksRouterService,
  ) {}

  /**
   * Load settings from storage
   */
  init() {
    this.preferredBrowser =
      (this.storages.app.getNumber(STORAGE_NAMESPACE) as 0 | 1) ?? undefined;
  }

  /**
   * Sets the preferred browser (default or in-app)
   */
  setPreferredBrowser(value: BrowserType) {
    this.preferredBrowser = value;
    this.storages.app.set(STORAGE_NAMESPACE, value);
  }

  shouldOpenInIABrowser(url: string): boolean {
    if (this.preferredBrowser === 1) {
      return false;
    }
    /**
     * TODO: do not open links such as minds links and youtube
     *       links in the IABrowser. Logic is TBD
     **/
    const excludedURLRegexes = [
      // regex for youtube videos
      /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?‌​=]*)?/,
    ];
    return !excludedURLRegexes.find(p => p.test(url));
  }

  /**
   * Open url
   * @param {string} url
   */
  open(url: string) {
    const navigatingToPro = url === MINDS_PRO;

    if (!url.startsWith('https://')) {
      if (
        APP_URI.startsWith('https://www.') &&
        url.startsWith(APP_URI.replace('https://www.', ''))
      ) {
        url = `https://www.${url}`;
      } else {
        url = `https://${url}`;
      }
    }

    if (url.startsWith(`${APP_URI}p/`)) {
      return this.navigation.navigate('WebContent', { path: url });
    }
    if (url.startsWith(`${APP_URI}pages/`)) {
      const page = url.replace(`${APP_URI}pages/`, '');

      return this.navigation.navigate('CustomPages', { page });
    }

    if (url.startsWith(APP_URI) && !navigatingToPro) {
      const routed = this.deeplink.navigate(url);
      if (routed) return;
    }

    if (
      this.preferredBrowser === undefined &&
      this.shouldOpenInIABrowser(url)
    ) {
      this.navigation.push('ChooseBrowserModal', {
        onSelected: () => this._open(url),
      });
    } else {
      this._open(url);
    }
  }

  private _open(url) {
    return this.shouldOpenInIABrowser(url)
      ? openLinkInInAppBrowser(url)
      : Linking.openURL(url);
  }
}
