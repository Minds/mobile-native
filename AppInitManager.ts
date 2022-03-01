import { Blurhash } from 'react-native-blurhash';
import RNBootSplash from 'react-native-bootsplash';
import { Linking, Alert, Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import ShareMenu from 'react-native-share-menu';

import { SettingsStore } from './src/settings/SettingsStore';
import pushService from './src/common/services/push.service';
import receiveShare from './src/common/services/receive-share.service';

import { GOOGLE_PLAY_STORE } from './src/config/Config';
import updateService from './src/common/services/update.service';
import logService from './src/common/services/log.service';
import sessionService from './src/common/services/session.service';
import deeplinkService from './src/common/services/deeplinks-router.service';
import boostedContentService from './src/common/services/boosted-content.service';
import NavigationService from './src/navigation/NavigationService';
import translationService from './src/common/services/translation.service';
import badgeService from './src/common/services/badge.service';
import Clipboard from '@react-native-clipboard/clipboard';
import mindsConfigService from './src/common/services/minds-config.service';
import openUrlService from '~/common/services/open-url.service';
import { updateGrowthBookAttributes } from 'ExperimentsProvider';

/**
 * App initialization manager
 */
export default class AppInitManager {
  initialized = false;
  shouldHandlePasswordReset = false;
  settingsStorePromise?: Promise<SettingsStore>;
  deeplinkPromise?: Promise<string | null>;
  deepLinkUrl = '';

  /**
   * Initialize services without waiting for the promises
   */
  initializeServices() {
    // ensure we run it once
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    // init push service
    pushService.init();

    // init settings loading
    this.deeplinkPromise = Linking.getInitialURL();

    // On app login (runs if the user login or if it is already logged in)
    sessionService.onLogin(this.onLogin);

    //on app logout
    sessionService.onLogout(this.onLogout);

    openUrlService.init();

    this.checkDeepLink().then(async shouldHandlePasswordReset => {
      if (shouldHandlePasswordReset) {
        sessionService.setReady();
        this.shouldHandlePasswordReset = true;
      } else {
        try {
          logService.info('[App] init session');
          const token = await sessionService.init();

          if (!token) {
            // update settings and init growthbook
            this.updateMindsConfigAndInitGrowthbook();

            logService.info('[App] there is no active session');
            RNBootSplash.hide({ fade: true });
          } else {
            logService.info('[App] session initialized');
          }
        } catch (err) {
          logService.exception('[App] Error initializing the app', err);
          Alert.alert(
            'Error',
            'There was an error initializing the app.\n Do you want to copy the stack trace.',
            [
              { text: 'Yes', onPress: () => Clipboard.setString(err.stack) },
              { text: 'No' },
            ],
            { cancelable: false },
          );
        }
      }
    });

    // clear cosine cache of blurhash
    Blurhash.clearCosineCache();
  }

  updateMindsConfigAndInitGrowthbook() {
    // init with current cached data
    updateGrowthBookAttributes();
    // Update the config
    mindsConfigService.update().then(() => {
      // if it changed we initialize growth book again
      updateGrowthBookAttributes();
    });
  }

  /**
   * Handle session logout
   */
  onLogout = () => {
    // clear app badge
    badgeService.setUnreadConversations(0);
    badgeService.setUnreadNotifications(0);
    translationService.purgeLanguagesCache();
    updateGrowthBookAttributes();
  };

  /**
   * Handle session login
   */
  onLogin = async () => {
    const user = sessionService.getUser();

    // update settings for this user and init growthbook
    this.updateMindsConfigAndInitGrowthbook();

    Sentry.configureScope(scope => {
      scope.setUser({ id: user.guid });
    });

    // register device token into backend on login
    pushService.registerToken();

    // request for permission (applies to iOS)
    pushService.requestNotificationPermission();

    // check update
    if (Platform.OS !== 'ios' && !GOOGLE_PLAY_STORE) {
      setTimeout(async () => {
        const user = sessionService.getUser();
        updateService.checkUpdate(!user.canary);
      }, 5000);
    }
  };

  async initialNavigationHandling() {
    // load minds settings and boosted content
    await boostedContentService.load();
    try {
      logService.info(
        '[App] navigating to initial screen',
        sessionService.initialScreen,
      );
      if (sessionService.initialScreen) {
        console.log('initialScreen', sessionService.initialScreen);
        NavigationService.navigate(sessionService.initialScreen, {
          initial: true,
        });
        sessionService.setInitialScreen('');
      }

      // handle deep link (if the app is opened by one)
      if (this.deepLinkUrl) {
        const deeplink = this.deepLinkUrl;
        setTimeout(() => {
          deeplinkService.navigate(deeplink);
        }, 300);
        this.deepLinkUrl = '';
      }

      // handle initial notifications (if the app is opened by tap on one)
      pushService.handleInitialNotification();

      // handle initial shared content`
      ShareMenu.getInitialShare(receiveShare.handle);

      if (sessionService.recoveryCodeUsed) {
        sessionService.setRecoveryCodeUsed(false);
        NavigationService.navigate('RecoveryCodeUsedScreen');
      }

      // hide splash
      RNBootSplash.hide({ fade: true });
    } catch (err) {
      logService.exception(err);
    }
  }

  /**
   * Run the session logic when the navigator is ready
   */
  onNavigatorReady = async () => {
    if (this.shouldHandlePasswordReset) {
      logService.info('[App] initializing session');
      this.handlePasswordResetDeepLink();
    } else {
      this.initialNavigationHandling();
    }
  };

  async checkDeepLink(): Promise<boolean> {
    this.deepLinkUrl = (await this.deeplinkPromise) || '';
    try {
      return (
        this.deepLinkUrl &&
        deeplinkService.cleanUrl(this.deepLinkUrl).startsWith('forgot-password')
      );
    } catch (err) {
      logService.exception(
        '[App] Error checking for password reset deep link',
        err,
      );
    }
    return false;
  }

  /**
   * Handle pre login deep links
   */
  handlePasswordResetDeepLink() {
    RNBootSplash.hide({ fade: true });

    deeplinkService.navToPasswordReset(this.deepLinkUrl);

    this.deepLinkUrl = '';
  }
}
