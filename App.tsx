//@ts-nocheck
import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  Linking,
  UIManager,
  AppState,
  AppStateStatus,
  NativeEventSubscription,
  EmitterSubscription,
} from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider, observer } from 'mobx-react';
import { setup } from 'react-native-iap';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
// import ShareMenu from 'react-native-share-menu';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { focusManager } from '@tanstack/react-query';

import { IS_IPAD } from '~/config/Config';

import NavigationService, {
  navigationRef,
} from './src/navigation/NavigationService';
import NavigationStack from './src/navigation/NavigationStack';
import { getStores } from './AppStores';
import './AppErrors';
import './src/common/services/socket.service';

import sessionService from './src/common/services/session.service';
import deeplinkService from './src/common/services/deeplinks-router.service';
import ErrorBoundary from './src/common/components/ErrorBoundary';
import ThemedStyles from './src/styles/ThemedStyles';
import { StoresProvider } from './src/common/hooks/use-stores';
import i18n from './src/common/services/i18n.service';

// import receiveShareService from './src/common/services/receive-share.service';
import appInitManager from './AppInitManager';
import AppMessageProvider from 'AppMessageProvider';
import * as SplashScreen from 'expo-splash-screen';
import FriendlyCaptchaProvider, {
  setFriendlyCaptchaReference,
} from '~/common/components/friendly-captcha/FriendlyCaptchaProvider';
import { Orientation, QueryProvider } from '~/services';
import { ConfigProvider } from '~/modules/livepeer';

import { FontsLoader } from 'FontsLoader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

appInitManager.initializeServices();

// Setup apple IAP to use storekit 2
setup({ storekitMode: 'STOREKIT2_MODE' });

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {};

export let APP_CONST = {
  realScreenHeight: 0,
};

/**
 * App
 */
@observer
class App extends Component<Props> {
  shareReceiveSubscription;

  constructor(
    props,
    private disposeLinkSubscription?: EmitterSubscription,
    private stateSubscription?: NativeEventSubscription,
    private backHandlerSubscription?: NativeEventSubscription,
  ) {
    super(props);
    if (IS_IPAD) {
      Orientation.unlock();
    } else {
      Orientation.lockPortrait();
    }
  }

  /**
   * On component did mount
   */
  componentDidMount() {
    // Register event listeners
    this.backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
    this.disposeLinkSubscription = Linking.addEventListener(
      'url',
      this.handleOpenURL,
    );
    // this.shareReceiveSubscription = ShareMenu.addNewShareListener(
    //   receiveShareService.handle,
    // );

    // send focus states to react query
    this.stateSubscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        focusManager.setFocused(status === 'active');
      },
    );
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.stateSubscription?.remove();
    this.disposeLinkSubscription?.remove();
    this.backHandlerSubscription?.remove();
    this.shareReceiveSubscription?.remove();
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
        deeplinkService.navigate(event.url, true);
        event.url = '';
      }, 100);
    }
  };

  report(...data) {
    console.log(data);
  }

  /**
   * Render
   */
  render() {
    // App not shown until the theme is loaded
    if (ThemedStyles.theme === -1) {
      return null;
    }

    const stores = getStores();

    return (
      <KeyboardProvider>
        <FontsLoader>
          <GestureHandlerRootView style={appContainerStyle}>
            <SafeAreaProvider>
              {sessionService.ready && (
                <StoresProvider>
                  <QueryProvider>
                    <Provider key="app" {...stores}>
                      <NavigationContainer
                        ref={navigationRef}
                        theme={ThemedStyles.navTheme}
                        onReady={appInitManager.onNavigatorReady}
                        onStateChange={NavigationService.onStateChange}>
                        <AppMessageProvider
                          key={`message_${ThemedStyles.theme}`}>
                          <FriendlyCaptchaProvider
                            ref={setFriendlyCaptchaReference}>
                            <PortalProvider>
                              <BottomSheetModalProvider>
                                <ErrorBoundary
                                  message="An error occurred"
                                  containerStyle={ThemedStyles.style.centered}>
                                  <ConfigProvider>
                                    <NavigationStack
                                      key={ThemedStyles.theme + i18n.locale}
                                    />
                                  </ConfigProvider>
                                </ErrorBoundary>
                              </BottomSheetModalProvider>
                            </PortalProvider>
                          </FriendlyCaptchaProvider>
                        </AppMessageProvider>
                      </NavigationContainer>
                    </Provider>
                  </QueryProvider>
                </StoresProvider>
              )}
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </FontsLoader>
      </KeyboardProvider>
    );
  }
}

export default App;

const appContainerStyle = ThemedStyles.combine(
  'flexContainer',
  'bgPrimaryBackground',
);

// if (__DEV__) {
//   require('./tron');
// }
