//@ts-nocheck
/**
 * Minds mobile app
 * https://www.minds.com
 *
 * @format
 */

import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  AppState,
  Linking,
  UIManager,
  RefreshControl,
  YellowBox,
} from 'react-native';
import { Provider, observer } from 'mobx-react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import ShareMenu from 'react-native-share-menu';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Orientation from 'react-native-orientation-locker';
import { PortalProvider } from '@gorhom/portal';
import NavigationService, {
  setTopLevelNavigator,
} from './src/navigation/NavigationService';
import { Audio } from 'expo-av';
import NavigationStack from './src/navigation/NavigationStack';
import { getStores } from './AppStores';
import './AppErrors';
import './src/common/services/socket.service';

import sessionService from './src/common/services/session.service';
import deeplinkService from './src/common/services/deeplinks-router.service';
import ErrorBoundary from './src/common/components/ErrorBoundary';
import TosModal from './src/tos/TosModal';
import ThemedStyles from './src/styles/ThemedStyles';
import { StoresProvider } from './src/common/hooks/use-stores';
import i18n from './src/common/services/i18n.service';

import receiveShareService from './src/common/services/receive-share.service';
import AppInitManager from './AppInitManager';
import { WCContextProvider } from './src/blockchain/v2/walletconnect/WalletConnectContext';
import analyticsService from './src/common/services/analytics.service';
import AppMessageProvider from 'AppMessageProvider';
import ExperimentsProvider from 'ExperimentsProvider';
import { storages } from '~/common/services/storage/storages.service';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

YellowBox.ignoreWarnings(['']);

const appInitManager = new AppInitManager();
appInitManager.initializeServices();

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type State = {
  appState: string;
  /**
   * the state of the navigator. Used to persist navigation on dev refresh
   */
  navigationState?: any;
  /**
   * is the app ready to be run? Used to persist navigation
   */
  isReady: boolean;
};

type Props = {};

export let APP_CONST = {
  realScreenHeight: 0,
};

/**
 * App
 */
@observer
class App extends Component<Props, State> {
  ShareReceiveListener;

  /**
   * State
   */
  state = {
    appState: AppState.currentState || '',
    navigationState: undefined,
    isReady: __DEV__ ? false : true,
  };

  /**
   * Handle app state changes
   */
  handleAppStateChange = nextState => {
    this.setState({ appState: nextState });
  };

  constructor(props) {
    super(props);
    Orientation.lockToPortrait();

    if (!RefreshControl.defaultProps) {
      RefreshControl.defaultProps = {};
    }
    RefreshControl.defaultProps.tintColor = ThemedStyles.getColor('IconActive');
    RefreshControl.defaultProps.colors = [ThemedStyles.getColor('IconActive')];
  }

  /**
   * On component did mount
   */
  componentDidMount() {
    // Register event listeners
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    Linking.addEventListener('url', this.handleOpenURL);
    AppState.addEventListener('change', this.handleAppStateChange);
    this.ShareReceiveListener = ShareMenu.addNewShareListener(
      receiveShareService.handle,
    );

    // set global audio settings for the app
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    if (__DEV__) {
      this._restoreNavState();
    }
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    Linking.removeEventListener('url', this.handleOpenURL);
    AppState.removeEventListener('change', this.handleAppStateChange);
    if (this.ShareReceiveListener) {
      this.ShareReceiveListener.remove();
    }
  }

  /**
   * Handle hardware back button
   */
  onBackPress = () => {
    try {
      NavigationService.goBack();
      return false;
    } catch (err) {
      return true;
    }
  };

  /**
   * Handle deeplink urls
   */
  handleOpenURL = event => {
    if (event.url) {
      // the var can be cleaned so we check again
      setTimeout(() => {
        deeplinkService.navigate(event.url);
        event.url = '';
      }, 100);
    }
  };

  onNavigationStateChange = (state: any) => {
    analyticsService.onNavigatorStateChange();
    if (__DEV__) {
      storages.app.setMapAsync(PERSISTENCE_KEY, state);
    }
  };

  /**
   * Restores the navigation state from the storage
   */
  private _restoreNavState = async () => {
    try {
      const initialUrl = await Linking.getInitialURL();

      // Only restore state if there's no deep link and we're not on web
      if (Platform.OS !== 'web' && initialUrl == null) {
        const navigationState = storages.app.getMap(PERSISTENCE_KEY);
        if (navigationState !== undefined) {
          this.setState({
            navigationState,
          });
        }
      }
    } finally {
      this.setState({ isReady: true });
    }
  };

  /**
   * Render
   */
  render() {
    // App not shown until the theme is loaded
    if (ThemedStyles.theme === -1) {
      return null;
    }

    if (!this.state.isReady) {
      return null;
    }

    const stores = getStores();

    // Should show auth screens?
    const showAuthNav = sessionService.showAuthNav;

    return (
      <ExperimentsProvider>
        <SafeAreaProvider>
          {sessionService.ready && (
            <NavigationContainer
              ref={setTopLevelNavigator}
              theme={ThemedStyles.navTheme}
              initialState={this.state.navigationState}
              onReady={appInitManager.onNavigatorReady}
              onStateChange={this.onNavigationStateChange}>
              <StoresProvider>
                <Provider key="app" {...stores}>
                  <AppMessageProvider key={`message_${ThemedStyles.theme}`}>
                    <PortalProvider>
                      <BottomSheetModalProvider>
                        <ErrorBoundary
                          message="An error occurred"
                          containerStyle={ThemedStyles.style.centered}>
                          <WCContextProvider>
                            <NavigationStack
                              key={ThemedStyles.theme + i18n.locale}
                              showAuthNav={showAuthNav}
                            />
                          </WCContextProvider>
                        </ErrorBoundary>
                      </BottomSheetModalProvider>
                    </PortalProvider>
                  </AppMessageProvider>
                </Provider>
              </StoresProvider>
            </NavigationContainer>
          )}
        </SafeAreaProvider>
        <TosModal user={stores.user} />
      </ExperimentsProvider>
    );
  }
}

export default App;
