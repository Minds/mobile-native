/**
 * Minds mobile app
 * https://www.minds.com
 *
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 * @flow
 */
import './global';
import './shim'
import crypto from "crypto"; // DO NOT REMOVE!
import codePush from "react-native-code-push"; // For auto updates

import React, {
  Component
} from 'react';

import {
  Observer,
  Provider,
} from 'mobx-react/native'  // import from mobx-react/native instead of mobx-react fix test

import {
  createNavigator,
  NavigationActions
} from 'react-navigation';

import NavigationService from './src/navigation/NavigationService';

import {
  BackHandler,
  Platform,
  AppState,
  Linking,
  Text,
  Alert,
} from 'react-native';

import CookieManager from 'react-native-cookies';

import KeychainModalScreen from './src/keychain/KeychainModalScreen';
import BlockchainTransactionModalScreen from './src/blockchain/transaction-modal/BlockchainTransactionModalScreen';
import NavigationStack from './src/navigation/NavigationStack';
import stores from './AppStores';
import './AppErrors';
import './src/common/services/socket.service';
import pushService from './src/common/services/push.service';
import mindsService from './src/common/services/minds.service';
import featureService from './src/common/services/features.service';
import receiveShare from './src/common/services/receive-share.service';
import sessionService from './src/common/services/session.service';
import deeplinkService from './src/common/services/deeplinks-router.service';
import badgeService from './src/common/services/badge.service';
import authService from './src/auth/AuthService';
import NotificationsService from "./src/notifications/NotificationsService";
import getMaches from './src/common/helpers/getMatches';
import {CODE_PUSH_TOKEN} from './src/config/Config';
import updateService from './src/common/services/update.service';

let deepLinkUrl = '';

// init push service
pushService.init();

CookieManager.clearAll();

// On app login (runs if the user login or if it is already logged in)
sessionService.onLogin(async () => {

  // load minds settings on login
  await mindsService.getSettings();

  // reload fatures on login
  await featureService.updateFeatures();

  // register device token into backend on login
  try {
    pushService.registerToken();
  } catch (err) {
    console.log('Error registering the push notification token', err);
  }

  // load nsfw from storage
  await stores.discovery.filters.init();

  // get onboarding progress
  const onboarding = await stores.onboarding.getProgress();

  if (onboarding && onboarding.show_onboarding) {
    sessionService.setInitialScreen('OnboardingScreen');
  }

  NavigationService.reset(sessionService.initialScreen);

  // check update
  if (Platform.OS !== 'ios') {
    setTimeout(async () => {
      updateService.checkUpdate();
    }, 5000);
  }

  try {
    // handle deep link (if the app is opened by one)
    if (deepLinkUrl) {
      deeplinkService.navigate(deepLinkUrl);
      deepLinkUrl = '';
    }

    // handle initial notifications (if the app is opened by tap on one)
    pushService.handleInitialNotification();

    // handle shared
    receiveShare.handle();
  } catch (err) {
    console.log(err);
  }
});

//on app logout
sessionService.onLogout(() => {
  // clear app badge
  badgeService.setUnreadConversations(0);
  badgeService.setUnreadNotifications(0);

  // clear minds settings
  mindsService.clear();
});

// disable yellow boxes
console.disableYellowBox = true;

/**
 * App
 */
@codePush
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    };
  }

  /**
   * Handle app state changes
   */
  handleAppStateChange = (nextState) => {
    // if the app turns active we check for shared
    if (this.state.appState.match(/inactive|background/) && nextState === 'active') {
      receiveShare.handle();
    }
    this.setState({appState: nextState})
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    if (!Text.defaultProps) Text.defaultProps = {};
    Text.defaultProps.style = {
      fontFamily: 'Roboto',
      color: '#444',
    };
  }

  /**
   * On component did mount
   */
  async componentDidMount() {
    try {
      deepLinkUrl = await Linking.getInitialURL();
    } catch (err) {
      console.log('Error getting initial deep link');
    }

    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    Linking.addEventListener('url', this.handleOpenURL);
    AppState.addEventListener('change', this.handleAppStateChange);

    if (!this.handlePasswordResetDeepLink()) {
      const token = await sessionService.init();

      if (!token) {
        NavigationService.reset('Login');
      }
    }

    this.checkForUpdates();
  }

  /**
   * Handle pre login deep links
   */
  handlePasswordResetDeepLink() {
    if (deepLinkUrl && deeplinkService.cleanUrl(deepLinkUrl).startsWith('forgot-password')) {
      const regex = /;username=(.*);code=(.*)/g;

      const params = getMaches(deepLinkUrl.replace(/%3B/g, ';'), regex);

      //sessionService.logout();
      NavigationService.navigate('Forgot', {username: params[1], code: params[2]});
      deepLinkUrl = '';
      return true;
    }
    return false;
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    Linking.removeEventListener('url', this.handleOpenURL);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  /**
   * Handle hardware back button
   */
  onBackPress = () => {
    const nav = NavigationService.getState();
    NavigationService.goBack();
    return nav !== NavigationService.getState();
  };

  /**
   * Handle deeplink urls
   */
  handleOpenURL = (event) => {
    deepLinkUrl = event.url;
    if (deepLinkUrl) this.handlePasswordResetDeepLink();
    if (deepLinkUrl) {
      setTimeout(() => {
        deeplinkService.navigate(deepLinkUrl);
        deepLinkUrl = '';
      }, 100);
    }
  }

  async checkForUpdates() {
    try {
      const params = {
        updateDialog: Platform.OS !== 'ios',
        installMode:  CodePush.InstallMode.ON_APP_RESUME,
      };

      if (CODE_PUSH_TOKEN) params.deploymentKey = CODE_PUSH_TOKEN;

      let response = await CodePush.sync(params);
    } catch (err) { }
  }

  /**
   * Render
   */
  render() {
    const app = (
      <Provider key="app" {...stores}>
        <Observer>{() =>
          <NavigationStack
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            />
        }</Observer>
      </Provider>
    );

    const keychainModal = (
      <KeychainModalScreen key="keychainModal" keychain={ stores.keychain } />
    );

    const blockchainTransactionModal = (
      <BlockchainTransactionModalScreen key="blockchainTransactionModal" blockchainTransaction={ stores.blockchainTransaction } />
    );

    return [ app, keychainModal, blockchainTransactionModal ];
  }
}
