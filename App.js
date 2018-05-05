import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import './global';
import './shim'
import crypto from "crypto"; // DO NOT REMOVE!

import React, {
  Component
} from 'react';

import {
  Observer,
  Provider,
} from 'mobx-react/native'  // import from mobx-react/native instead of mobx-react fix test

import {
  addNavigationHelpers,
  NavigationActions
} from 'react-navigation';

import {
  BackHandler,
  Platform,
  AppState,
  Linking,
  Text,
} from 'react-native';

import KeychainModalScreen from './src/keychain/KeychainModalScreen';
import BlockchainTransactionModalScreen from './src/blockchain/transaction-modal/BlockchainTransactionModalScreen';
import NavigatorStore from './src/common/stores/NavigationStore';
import NavigationStoreService from './src/common/services/navigation.service';
import Stack from './AppScreens';
import stores from './AppStores';
import './AppErrors';
import './src/common/services/socket.service';
import pushService from './src/common/services/push.service';
import receiveShare from './src/common/services/receive-share.service';
import sessionService from './src/common/services/session.service';
import deeplinkService from './src/common/services/deeplinks-router.service';
import badgeService from './src/common/services/badge.service';

// build navigation store
stores.navigatorStore = new NavigatorStore(Stack);

// Setup navigation store proxy (to avoid circular references issues)
NavigationStoreService.set(stores.navigatorStore);

// init push service
pushService.init();

// On app login (runs if the user login or if it is already logged in)
sessionService.onLogin(async () => {

  // register device token into backend on login
  pushService.registerToken();
  
  // load user
  await stores.user.load();

  stores.navigatorStore.resetNavigate('Tabs');

  // handle deep link (if the app is opened by one)
  Linking.getInitialURL().then(url => url && deeplinkService.navigate(url));

  // handle initial notifications (if the app is opened by tap on one)
  pushService.handleInitialNotification();

  // handle shared 
  receiveShare.handle();
});

//on app logout
sessionService.onLogout(() => {
  // clear app badge
  badgeService.setUnreadConversations(0);
  badgeService.setUnreadNotifications(0);
});

// disable yellow boxes
//console.disableYellowBox = true;

/**
 * App
 */
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
    Text.defaultProps.style = {
      fontFamily: 'Roboto',
      color: '#444',
    };
  }

  /**
   * On component did mount
   */
  async componentDidMount() {
    const token = await sessionService.init();

    if (!token) {
      stores.navigatorStore.resetNavigate('Login');
    }

    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    Linking.addEventListener('url', event => this.handleOpenURL(event.url));
    AppState.addEventListener('change', this.handleAppStateChange);
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
    const { dispatch } = this.props;
    if (stores.navigatorStore.navigationState.index === 0) {
      return false;
    }
    stores.navigatorStore.dispatch(NavigationActions.back());
    return true;
  };

  /**
   * Handle deeplink urls
   */
  handleOpenURL = (url) => {
    setTimeout(() => {
      deeplinkService.navigate(url);
    }, 100);
  }

  /**
   * Render
   */
  render() {
    const app = (
      <Provider key="app" {...stores}>
        <Observer>{
        () => <Stack navigation={addNavigationHelpers({
          dispatch: stores.navigatorStore.dispatch,
          state: stores.navigatorStore.navigationState,
          addListener: () => { }
        })}/>
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
