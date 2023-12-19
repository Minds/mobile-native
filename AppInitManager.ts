import { Linking, Alert, Platform } from 'react-native';
// import ShareMenu from 'react-native-share-menu';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';

import pushService from './src/common/services/push.service';
// import receiveShare from './src/common/services/receive-share.service';

import {
  GOOGLE_PLAY_STORE,
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
import badgeService from './src/common/services/badge.service';
import Clipboard from '@react-native-clipboard/clipboard';
import mindsConfigService from './src/common/services/minds-config.service';
import openUrlService from '~/common/services/open-url.service';
import { updateGrowthBookAttributes } from 'ExperimentsProvider';
import checkTOS from '~/tos/checkTOS';
import { storeRatingService } from 'modules/store-rating';
import portraitBoostedContentService from './src/portrait/services/portraitBoostedContentService';
import socketService from '~/common/services/socket.service';
import blockListService from '~/common/services/block-list.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { queryClient } from '~/services';

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

    // On app login (runs if the user login or if it is already logged in)
    sessionService.onLogin(this.onLogin);

    //on app logout
    sessionService.onLogout(this.onLogout);

    openUrlService.init();

    storeRatingService.track('appSession');

    // if (!__DEV__) {
    //   codePushStore.syncCodepush({
    //     onDownload: () => {
    //       InteractionManager.runAfterInteractions(() => {
    //         SplashScreen.hideAsync();
    //       });
    //     },
    //   });
    // }

    try {
      logService.info('[App] init session');
      const token = await sessionService.init();

      if (!token) {
        // update settings and init growthbook
        this.updateMindsConfigAndInitGrowthbook();

        logService.info('[App] there is no active session');

        // if (await codePushStore.checkForUpdates()) {
        //   // the syncCodepush will remove the splash once the SyncScreen is pushed,
        //   // but here we will hide the splash screen after a delay as a timeout if
        //   // anything goes wrong.
        //   setTimeout(() => {
        //     SplashScreen.hideAsync();
        //   }, 400);
        // } else {
        //   SplashScreen.hideAsync();
        // }
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 400);
      } else {
        logService.info('[App] session initialized');
      }
    } catch (err) {
      logService.exception('[App] Error initializing the app', err);
      if (err instanceof Error) {
        Alert.alert(
          'Error',
          'There was an error initializing the app.\n Do you want to copy the stack trace.',
          [
            {
              text: 'Yes',
              onPress: () => {
                if (err instanceof Error) {
                  Clipboard.setString(err.stack || '');
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

  updateMindsConfigAndInitGrowthbook() {
    // init with current cached data
    updateGrowthBookAttributes();

    const afterUpdate = () => {
      // if it changed we initialize growth book again
      updateGrowthBookAttributes();

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
    badgeService.setUnreadNotifications(0);
    translationService.purgeLanguagesCache();
    updateGrowthBookAttributes();
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
    this.updateMindsConfigAndInitGrowthbook();

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

    // request for permission (applies to iOS)
    // pushService.requestNotificationPermission();

    // check update
    if (Platform.OS !== 'ios' && !GOOGLE_PLAY_STORE) {
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
