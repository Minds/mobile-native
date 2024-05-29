import { Linking, Alert } from 'react-native';
// import ShareMenu from 'react-native-share-menu';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';

import pushService from './src/common/services/push.service';
// import receiveShare from './src/common/services/receive-share.service';

import {
  IS_ANDROID_OSS,
  IS_TENANT,
  IS_TENANT_PREVIEW,
} from './src/config/Config';
import updateService from './src/common/services/update.service';
import logService from './src/common/services/log.service';
import sessionService from './src/common/services/session.service';
import deeplinkService from './src/common/services/deeplinks-router.service';
import { boostedContentService } from 'modules/boost';
import NavigationService from './src/navigation/NavigationService';
import translationService from './src/common/services/translation.service';
import mindsConfigService from './src/common/services/minds-config.service';
import openUrlService from '~/common/services/open-url.service';
import { updateFeatureFlags } from 'ExperimentsProvider';
import checkTOS from '~/tos/checkTOS';
import * as Clipboard from 'expo-clipboard';
import { storeRatingService } from 'modules/store-rating';
import portraitBoostedContentService from './src/portrait/services/portraitBoostedContentService';
import socketService from '~/common/services/socket.service';
import blockListService from '~/common/services/block-list.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { queryClient } from '~/services';
import videoPlayerService from '~/common/services/video-player.service';
import { updateCustomNavigation } from '~/modules/navigation/service/custom-navigation.service';

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
    socketService.init();

    // init block list service
    blockListService.init();

    // init in feed notices service
    inFeedNoticesService.init();

    // init video player service
    videoPlayerService.init();

    // On app login (runs if the user login or if it is already logged in)
    sessionService.onLogin(this.onLogin);

    //on app logout
    sessionService.onLogout(this.onLogout);

    openUrlService.init();

    // update custom navigation data
    updateCustomNavigation();

    storeRatingService.track('appSession');

    try {
      logService.info('[App] init session');
      const token = await sessionService.init();

      if (!token) {
        // update settings and init growthbook
        this.updateMindsConfigAndInitFeatureFlags();
        logService.info('[App] there is no active session');
        SplashScreen.hideAsync();
      } else {
        logService.info('[App] session initialized');
      }
    } catch (err) {
      logService.exception('[App] Error initializing the app', err);
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
    mindsConfigService.update().then(afterUpdate);
  }

  /**
   * Handle session logout
   */
  onLogout = () => {
    // clear app badge
    pushService.setBadgeCount(0);
    pushService.clearNotifications();
    translationService.purgeLanguagesCache();
    updateFeatureFlags();
    boostedContentService.clear();
    portraitBoostedContentService.clear();
    queryClient.clear();
  };

  /**
   * Handle session login
   */
  onLogin = async () => {
    const user = sessionService.getUser();

    // update settings for this user and init growthbook
    this.updateMindsConfigAndInitFeatureFlags();

    // load boosted content
    if (!IS_TENANT) {
      boostedContentService.load();
      portraitBoostedContentService.load();
    }

    Sentry.configureScope(scope => {
      scope.setUser({ id: user.guid });
    });

    // register device token into backend on login
    pushService.registerToken();

    // OSS check update
    if (IS_ANDROID_OSS) {
      setTimeout(async () => {
        const user = sessionService.getUser();
        updateService.checkUpdate(!user.canary);
      }, 5000);
    }

    // if the navigator is ready, handle initial navigation (this is needed when the user lands on the welcome screen)
    if (this.navReady) {
      // when the experiment is enabled, we don't want to navigate to the initial screen because the navigation is done after the email verification.
      this.initialNavigationHandling();
    }
  };

  navigateToInitialScreen() {
    if (sessionService.initialScreen) {
      logService.info(
        '[App] navigating to initial screen: ' + sessionService.initialScreen,
      );
      NavigationService.navigate(sessionService.initialScreen, {
        initial: true,
        ...sessionService.initialScreenParams,
      });
    }

    sessionService.setInitialScreen('');
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
          deeplinkService.navigate(deepLinkUrl);
        }, 300);
      }

      // handle initial notifications (if the app is opened by tap on one)
      pushService.handleInitialNotification();

      // handle initial shared content`
      // ShareMenu.getInitialShare(receiveShare.handle);

      if (sessionService.recoveryCodeUsed) {
        sessionService.setRecoveryCodeUsed(false);
        NavigationService.navigate('RecoveryCodeUsedScreen');
      }
      SplashScreen.hideAsync();
    } catch (err) {
      SplashScreen.hideAsync();
      logService.exception(err);
    }
  }

  /**
   * Run the session logic when the navigator is ready
   */
  onNavigatorReady = async () => {
    this.navReady = true;
    // Emit first state change
    NavigationService.onStateChange();
    // if the user is already logged in, handle initial navigation
    if (sessionService.userLoggedIn) {
      this.initialNavigationHandling();
    } else if (IS_TENANT_PREVIEW) {
      const deepLinkUrl = (await Linking.getInitialURL()) || '';
      if (deepLinkUrl) {
        setTimeout(() => {
          deeplinkService.navigate(deepLinkUrl);
        }, 300);
      }
    }
  };
}

const appInitManagerInstace = new AppInitManager();

export default appInitManagerInstace;
