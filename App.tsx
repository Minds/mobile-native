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
  Text,
  StatusBar,
  UIManager,
  RefreshControl,
} from 'react-native';
import { Provider, observer } from 'mobx-react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import ShareMenu from 'react-native-share-menu';
import NavigationService, {
  setTopLevelNavigator,
} from './src/navigation/NavigationService';
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
import AppMessages from './AppMessages';
import i18n from './src/common/services/i18n.service';

// disable warnings
import { YellowBox } from 'react-native';
import receiveShareService from './src/common/services/receive-share.service';
import AppInitManager from './AppInitManager';
import { ScreenHeightProvider } from './src/common/components/KeyboardSpacingView';
import { WCContextProvider } from './src/blockchain/v2/walletconnect/WalletConnectContext';
YellowBox.ignoreWarnings(['']);

const stores = getStores();

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
  };

  /**
   * Handle app state changes
   */
  handleAppStateChange = (nextState) => {
    this.setState({ appState: nextState });
  };

  constructor(props) {
    super(props);

    // workaround to set default font;

    let oldRender = Text.render;
    Text.render = function (...args) {
      let origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [
          ThemedStyles.style.colorPrimaryText,
          { fontFamily: 'Roboto' },
          origin.props.style,
        ],
      });
    };

    if (!RefreshControl.defaultProps) {
      RefreshControl.defaultProps = {};
    }
    RefreshControl.defaultProps.tintColor = ThemedStyles.getColor(
      'icon_active',
    );
    RefreshControl.defaultProps.colors = [ThemedStyles.getColor('icon_active')];
  }

  /**
   * On component did mount
   */
  async componentDidMount() {
    // Register event listeners
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    Linking.addEventListener('url', this.handleOpenURL);
    AppState.addEventListener('change', this.handleAppStateChange);
    this.ShareReceiveListener = ShareMenu.addNewShareListener(
      receiveShareService.handle,
    );
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
  handleOpenURL = (event) => {
    if (event.url) {
      // the var can be cleaned so we check again
      if (!appInitManager.handlePasswordResetDeepLink()) {
        setTimeout(() => {
          deeplinkService.navigate(event.url);
          event.url = '';
        }, 100);
      }
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

    const isLoggedIn = sessionService.userLoggedIn;

    const statusBarStyle =
      ThemedStyles.theme === 0 ? 'dark-content' : 'light-content';

    const app = (
      <SafeAreaProvider key={'App'}>
        <ScreenHeightProvider>
          <NavigationContainer
            ref={setTopLevelNavigator}
            theme={ThemedStyles.navTheme}
            onReady={appInitManager.onNavigatorReady}>
            <StoresProvider>
              <Provider key="app" {...stores}>
                <ErrorBoundary
                  message="An error occurred"
                  containerStyle={ThemedStyles.style.centered}>
                  <StatusBar
                    barStyle={statusBarStyle}
                    backgroundColor={ThemedStyles.getColor(
                      'secondary_background',
                    )}
                  />
                  <WCContextProvider>
                    <NavigationStack
                      key={ThemedStyles.theme + i18n.locale}
                      isLoggedIn={isLoggedIn}
                    />
                  </WCContextProvider>
                  <AppMessages />
                </ErrorBoundary>
              </Provider>
            </StoresProvider>
          </NavigationContainer>
        </ScreenHeightProvider>
      </SafeAreaProvider>
    );

    const tosModal = <TosModal user={stores.user} key="tosModal" />;

    return [app, tosModal];
  }
}

export default App;
