import './global';
import './shim'
import crypto from "crypto"; // DO NOT REMOVE!

import React, {
  Component
} from 'react';

import {
  Observer,
  Provider
} from 'mobx-react/native'  // import from mobx-react/native instead of mobx-react fix test

import {
  addNavigationHelpers,
  NavigationActions
} from 'react-navigation';

import {
  BackHandler
} from 'react-native';

import KeychainModalScreen from './src/keychain/KeychainModalScreen';
import BlockchainTransactionModalScreen from './src/blockchain/transaction-modal/BlockchainTransactionModalScreen';
import NavigatorStore from './src/common/stores/NavigationStore';
import Stack from './AppScreens';
import stores from './AppStores';
import './AppErrors';

// build navigation store
stores.navigatorStore = new NavigatorStore(Stack);

/**
 * App
 */
export default class App extends Component {

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
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
   * Render
   */
  render() {
    const app = (
      <Provider key="app" {...stores}>
        <Observer>{
        () => <Stack navigation={addNavigationHelpers({
          dispatch: stores.navigatorStore.dispatch,
          state: stores.navigatorStore.navigationState,
        })} />
      }</Observer>
      </Provider>
    );

    const keychainModal = (
      <KeychainModalScreen key="keychainModal" keychain={ stores.keychain } />
    );

    const blockchainTransactionModal = (
      <BlockchainTransactionModalScreen key="blockchainTransactionModal" blockchainTransaction={ stores.blockchainTransaction } />
    );

    return [ app, blockchainTransactionModal, keychainModal ];
  }
}
