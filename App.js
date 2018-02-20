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
import sessionService from './src/common/services/session.service';

// build navigation store
stores.navigatorStore = new NavigatorStore(Stack);

// <hack>
// TODO: Remove this (and refactor usages) when upgrading to react-navigation > 1.0.3
const prevGetStateForActionStackNavigator = stores.navigatorStore.navigator.router.getStateForAction;

stores.navigatorStore.navigator.router = {
  ...stores.navigatorStore.navigator.router,
  getStateForAction(action, state) {
    if (state && action.type === 'ReplaceCurrentScreen') {
      const routes = state.routes.slice(0, state.routes.length - 1);
      routes.push(action);
      return {
        ...state,
        routes,
        index: routes.length - 1,
      };
    }
    return prevGetStateForActionStackNavigator(action, state);
  },
};
// </hack>

// Setup navigation store proxy (to avoid circular references issues)
NavigationStoreService.set(stores.navigatorStore);


// init push service
pushService.init();
// register device token into backend on login
sessionService.onLogin(() => {
  pushService.registerToken();
})


/**
 * App
 */
export default class App extends Component {

  componentWillMount() {
    Text.defaultProps.style = {
      fontFamily: 'Roboto',
      color: '#444',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    Linking.addEventListener('url', event => this.handleOpenURL(event.url));
    Linking.getInitialURL().then(url => url && this.handleOpenURL(url));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    Linking.removeEventListener('url', this.handleOpenURL);
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

  handleOpenURL = (url) => {
    const path = url.split('://')[1];
    const action = stores.navigatorStore.navigator.router.getActionForPathAndParams(path);
    if (action)
      stores.navigatorStore.dispatch(action);
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
