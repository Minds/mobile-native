import RNBootSplash from 'react-native-bootsplash';
import { Linking, Alert, Clipboard, Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import ShareMenu from 'react-native-share-menu';

import settingsStore, { SettingsStore } from './src/settings/SettingsStore';
import apiService from './src/common/services/api.service';
import pushService from './src/common/services/push.service';
import mindsService from './src/common/services/minds.service';
import receiveShare from './src/common/services/receive-share.service';
import sqliteStorageProviderService from './src/common/services/sqlite-storage-provider.service';
import getMaches from './src/common/helpers/getMatches';
import { GOOGLE_PLAY_STORE } from './src/config/Config';
import updateService from './src/common/services/update.service';
import logService from './src/common/services/log.service';
import connectivityService from './src/common/services/connectivity.service';
import portraitContentService from './src/portrait/PortraitContentService';
import sessionService from './src/common/services/session.service';
import commentStorageService from './src/comments/CommentStorageService';
import deeplinkService from './src/common/services/deeplinks-router.service';
import boostedContentService from './src/common/services/boosted-content.service';
import NavigationService from './src/navigation/NavigationService';
import entitiesStorage from './src/common/services/sql/entities.storage';
import feedsStorage from './src/common/services/sql/feeds.storage';
import translationService from './src/common/services/translation.service';
import badgeService from './src/common/services/badge.service';
import { getStores } from './AppStores';

/**
 * App initialization manager
 */
export default class AppInitManager {
  initialized = false;

  mindsSettingsPromise?: Promise<any>;
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

    // fire sqlite init
    sqliteStorageProviderService.get();

    // clear old cookies
    apiService.clearCookies();

    // init settings loading
    this.mindsSettingsPromise = mindsService.getSettings();
    this.settingsStorePromise = settingsStore.init();
    this.deeplinkPromise = Linking.getInitialURL();

    // On app login (runs if the user login or if it is already logged in)
    sessionService.onLogin(this.onLogin);

    //on app logout
    sessionService.onLogout(this.onLogout);
  }

  /**
   * Handle session logout
   */
  onLogout = () => {
    // clear app badge
    badgeService.setUnreadConversations(0);
    badgeService.setUnreadNotifications(0);
    // clear offline cache
    entitiesStorage.removeAll();
    feedsStorage.removeAll();
    getStores().notifications.clearLocal();
    getStores().groupsBar.clearLocal();
    translationService.purgeLanguagesCache();
  };

  /**
   * Handle session login
   */
  onLogin = async () => {
    const user = sessionService.getUser();

    Sentry.configureScope((scope) => {
      scope.setUser({ id: user.guid });
    });

    logService.info('[App] Getting minds settings and onboarding progress');

    // load minds settings and boosted content
    await Promise.all([
      this.mindsSettingsPromise,
      boostedContentService.load(),
    ]);

    logService.info('[App] updatting features');

    // register device token into backend on login

    pushService.registerToken();

    logService.info(
      '[App] navigating to initial screen',
      sessionService.initialScreen,
    );

    // hide splash
    RNBootSplash.hide({ duration: 450 });

    // check update
    if (Platform.OS !== 'ios' && !GOOGLE_PLAY_STORE) {
      setTimeout(async () => {
        const user = sessionService.getUser();
        updateService.checkUpdate(!user.canary);
      }, 5000);
    }

    try {
      NavigationService.navigate(sessionService.initialScreen);

      // return to default init screen
      sessionService.setInitialScreen('Tabs');

      // handle deep link (if the app is opened by one)
      if (this.deepLinkUrl) {
        deeplinkService.navigate(this.deepLinkUrl);
        this.deepLinkUrl = '';
      }

      // handle initial notifications (if the app is opened by tap on one)
      pushService.handleInitialNotification();

      // handle initial shared content`
      ShareMenu.getInitialShare(receiveShare.handle);
    } catch (err) {
      logService.exception(err);
    }

    // fire offline cache garbage collector 30 seconds after start
    setTimeout(() => {
      if (!connectivityService.isConnected) return;
      entitiesStorage.removeOlderThan(30);
      feedsStorage.removeOlderThan(30);
      commentStorageService.removeOlderThan(30);
      portraitContentService.removeOlderThan(3);
    }, 30000);
  };

  /**
   * Run the session logic when the navigator is ready
   */
  onNavigatorReady = async () => {
    try {
      // load app setting before start
      const results = await Promise.all([
        this.settingsStorePromise,
        this.deeplinkPromise,
      ]);

      this.deepLinkUrl = results[1] || '';

      if (!this.handlePasswordResetDeepLink()) {
        logService.info('[App] initializing session');

        const token = await sessionService.init();

        if (!token) {
          logService.info('[App] there is no active session');
          RNBootSplash.hide({ duration: 250 });
          // NavigationService.navigate('Auth', { screen: 'Login'});
        } else {
          logService.info('[App] session initialized');
        }
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
  };

  /**
   * Handle pre login deep links
   */
  handlePasswordResetDeepLink() {
    try {
      if (
        this.deepLinkUrl &&
        deeplinkService.cleanUrl(this.deepLinkUrl).startsWith('forgot-password')
      ) {
        const regex = /;username=(.*);code=(.*)/g;

        const params = getMaches(this.deepLinkUrl.replace(/%3B/g, ';'), regex);

        //sessionService.logout();
        NavigationService.navigate('Forgot', {
          username: params[1],
          code: params[2],
        });
        this.deepLinkUrl = '';
        return true;
      }
    } catch (err) {
      logService.exception(
        '[App] Error checking for password reset deep link',
        err,
      );
    }
    return false;
  }
}
