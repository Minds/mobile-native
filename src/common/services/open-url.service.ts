import { APP_URI, MINDS_PRO } from '../../config/Config';
import { Alert, Linking } from 'react-native';
import deeplinksRouterService from './deeplinks-router.service';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import ThemedStyles from '../../styles/ThemedStyles';
import { storages } from './storage/storages.service';
import NavigationService from '~/navigation/NavigationService';

const STORAGE_NAMESPACE = 'openLinksBrowser';

type BrowserType = 0 | 1; // not defined, 0 in app, 1 default browser

/**
 * Open url service
 */
export class OpenURLService {
  preferredBrowser?: BrowserType = undefined;

  /**
   * Load settings from storage
   */
  init() {
    this.preferredBrowser =
      (storages.app.getInt(STORAGE_NAMESPACE) as 0 | 1) ?? undefined;
  }

  /**
   * Sets the preferred browser (default or in-app)
   */
  setPreferredBrowser(value: BrowserType) {
    this.preferredBrowser = value;
    storages.app.setInt(STORAGE_NAMESPACE, value);
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

  async openLinkInInAppBrowser(url) {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: ThemedStyles.getColor('PrimaryBackground'),
          preferredControlTintColor: ThemedStyles.getColor('PrimaryText'),
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: ThemedStyles.getColor('PrimaryBackground'),
          secondaryToolbarColor: ThemedStyles.getColor('SecondaryBackground'),
          navigationBarColor: ThemedStyles.getColor('PrimaryBackground'),
          navigationBarDividerColor: ThemedStyles.getColor(
            'SecondaryBackground',
          ),
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          // FIXME: these animations aren't currently working
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          // headers: {
          //   'my-custom-header': 'my custom header value',
          // },
        });
      } else Linking.openURL(url);
    } catch (error) {
      if (typeof error === 'string') {
        Alert.alert(error);
      } else if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
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
      return NavigationService.navigate('WebContent', { path: url });
    }
    if (url.startsWith(`${APP_URI}pages/`)) {
      const page = url.replace(`${APP_URI}pages/`, '');

      return NavigationService.navigate('CustomPages', { page });
    }

    if (url.startsWith(APP_URI) && !navigatingToPro) {
      const routed = deeplinksRouterService.navigate(url);
      if (routed) return;
    }

    if (
      this.preferredBrowser === undefined &&
      this.shouldOpenInIABrowser(url)
    ) {
      NavigationService.push('ChooseBrowserModal', {
        onSelected: () => this._open(url),
      });
    } else {
      this._open(url);
    }
  }

  private _open(url) {
    return this.shouldOpenInIABrowser(url)
      ? this.openLinkInInAppBrowser(url)
      : Linking.openURL(url);
  }
}

const openUrlService = new OpenURLService();

export default openUrlService;
