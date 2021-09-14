//@ts-nocheck
import { MINDS_URI, MINDS_PRO } from '../../config/Config';
import { Alert, Linking } from 'react-native';
import deeplinksRouterService from './deeplinks-router.service';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * Open url service
 */
class OpenURLService {
  shouldOpenInIABrowser(url: string): boolean {
    /**
     * TODO: do not open links such as minds links and youtube
     *       links in the IABrowser. Logic is TBD
     **/
    const excludedURLs = ['youtube.com'].map(url => new URL(url));
    return !excludedURLs.find(p => url.includes(String(p)));
  }

  async openLinkInInAppBrowser(url) {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
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
      Alert.alert(error.message);
    }
  }

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

    return this.shouldOpenInIABrowser(url)
      ? this.openLinkInInAppBrowser(url)
      : Linking.openURL(url);
  }
}

export default new OpenURLService();
