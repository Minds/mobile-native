import { Linking, Alert } from 'react-native';
// import ShareMenu from 'react-native-share-menu';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Clipboard from 'expo-clipboard';

// import receiveShare from './src/common/services/receive-share.service';
import {
  IS_ANDROID_OSS,
  IS_IOS,
  IS_TENANT,
  IS_TENANT_PREVIEW,
} from './src/config/Config';
import { updateFeatureFlags } from 'ExperimentsProvider';
import checkTOS from '~/tos/checkTOS';
import { queryClient } from '~/services';
import { updateCustomNavigation } from '~/modules/navigation/service/custom-navigation.service';
import serviceProvider from '~/services/serviceProvider';

/**
 * App initialization manager
 */
export class AppInitManager {
  initialized = false;
  navReady: boolean = false;

  /**
   * Initialize services without waiting for the promises
   */
  async initializeServices() {
    serviceProvider.socket.init();

    // init block list service
    serviceProvider.resolve('blockList').init();

    // init in feed notices service
    serviceProvider.resolve('inFeedNotices').init();

    // init video player service
    serviceProvider.resolve('videoPlayer').init();

    // On app login (runs if the user login or if it is already logged in)
    serviceProvider.session.onLogin(this.onLogin);

    //on app logout
    serviceProvider.session.onLogout(this.onLogout);

    serviceProvider.resolve('openURL').init();

    // update custom navigation data
    updateCustomNavigation();

    serviceProvider.resolve('storeRating').track('appSession');

    try {
      serviceProvider.log.info('[App] init session');
      const token = await serviceProvider.session.init();

      if (!token) {
        // update settings and init growthbook
        this.updateMindsConfigAndInitFeatureFlags();
        serviceProvider.log.info('[App] there is no active session');
        SplashScreen.hideAsync();
      } else {
        serviceProvider.log.info('[App] session initialized');
      }
    } catch (err) {
      serviceProvider.log.exception('[App] Error initializing the app', err);
      if (err instanceof Error) {
        console.error('INIT ERROR', err.stack);
        Alert.alert(
          'Error',
          'There was an error initializing the app.\n Do you want to copy the stack trace.',
          [
            {
              text: 'Yes',
              onPress: () => {
                if (err instanceof Error) {
                  Clipboard.setStringAsync(err.stack || '');
                }
              },
            },
            { text: 'No' },
          ],
          { cancelable: false },
        );
      }
    }
  }

  updateMindsConfigAndInitFeatureFlags() {
    // init with current cached data
    updateFeatureFlags();

    const afterUpdate = () => {
      // if it changed we initialize growth book again
      updateFeatureFlags();

      // Check Terms of service
      checkTOS();
    };

    // Update the config
    serviceProvider.config.update().then(afterUpdate);
  }

  /**
   * Handle session logout
   */
  onLogout = () => {
    // clear app badge
    const pushService = serviceProvider.resolve('push');
    pushService.setBadgeCount(0);
    pushService.clearNotifications();
    serviceProvider.resolve('translation').purgeLanguagesCache();
    updateFeatureFlags();
    serviceProvider.resolve('boostedContent').clear();
    serviceProvider.resolve('portraitBoostedContent').clear();
    queryClient.clear();
  };

  /**
   * Handle session login
   */
  onLogin = async () => {
    const user = serviceProvider.session.getUser();

    // update settings for this user and init growthbook
    this.updateMindsConfigAndInitFeatureFlags();

    // load boosted content
    if (!IS_TENANT) {
      serviceProvider.resolve('boostedContent').load();
      serviceProvider.resolve('portraitBoostedContent').load();
    }

    // set user id for sentry
    Sentry.setUser({ id: user.guid });

    // register device token into backend on login
    serviceProvider.resolve('push').registerToken();

    // OSS check update
    if (IS_ANDROID_OSS) {
      setTimeout(async () => {
        const user = serviceProvider.session.getUser();
        serviceProvider.resolve('update').checkUpdate(!user.canary);
      }, 5000);
    }

    if (IS_IOS) {
      setTimeout(() => {
        const {
          requestTrackingPermission,
        } = require('~/modules/tracking-transparency/tracking-transparency.service');
        requestTrackingPermission();
      }, 3000);
    }

    // if the navigator is ready, handle initial navigation (this is needed when the user lands on the welcome screen)
    if (this.navReady) {
      // when the experiment is enabled, we don't want to navigate to the initial screen because the navigation is done after the email verification.
      this.initialNavigationHandling();
    }
  };

  navigateToInitialScreen() {
    if (serviceProvider.session.initialScreen) {
      serviceProvider.log.info(
        '[App] navigating to initial screen: ' +
          serviceProvider.session.initialScreen,
      );
      serviceProvider.navigation.navigate(
        serviceProvider.session.initialScreen,
        {
          initial: true,
          ...serviceProvider.session.initialScreenParams,
        },
      );
    }

    serviceProvider.session.setInitialScreen('');
  }

  async initialNavigationHandling() {
    // ensure we run it once
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    console.log('[App] initial Navigation Handling');
    try {
      const deepLinkUrl = (await Linking.getInitialURL()) || '';

      // handle deep link (if the app is opened by one)
      if (deepLinkUrl) {
        setTimeout(() => {
          serviceProvider.resolve('deepLinks').navigate(deepLinkUrl, true);
        }, 300);
      }

      // handle initial notifications (if the app is opened by tap on one)
      serviceProvider.resolve('push').handleInitialNotification();

      // handle initial shared content`
      // ShareMenu.getInitialShare(receiveShare.handle);

      if (serviceProvider.session.recoveryCodeUsed) {
        serviceProvider.session.setRecoveryCodeUsed(false);
        serviceProvider.navigation.navigate('RecoveryCodeUsedScreen');
      }
      SplashScreen.hideAsync();
    } catch (err) {
      SplashScreen.hideAsync();
      serviceProvider.log.exception(err);
    }
  }

  /**
   * Run the session logic when the navigator is ready
   */
  onNavigatorReady = async () => {
    this.navReady = true;
    // Emit first state change
    serviceProvider.navigation.onStateChange();
    // if the user is already logged in, handle initial navigation
    if (serviceProvider.session.userLoggedIn) {
      this.initialNavigationHandling();
    } else if (IS_TENANT_PREVIEW) {
      const deepLinkUrl = (await Linking.getInitialURL()) || '';
      if (deepLinkUrl) {
        setTimeout(() => {
          serviceProvider.resolve('deepLinks').navigate(deepLinkUrl);
        }, 300);
      }
    }
  };
}

const appInitManagerInstace = new AppInitManager();

export default appInitManagerInstace;
