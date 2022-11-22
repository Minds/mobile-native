/* eslint-disable react-native/no-inline-styles */
//@ts-nocheck
/**
 * Minds mobile app
 * https://www.minds.com
 *
 * @format
 */

import React, {
  Component,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  AppState,
  BackHandler,
  Platform,
  Linking,
  UIManager,
  RefreshControl,
  YellowBox,
} from 'react-native';
import { Provider, observer } from 'mobx-react';
import codePush from 'react-native-code-push';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import ShareMenu from 'react-native-share-menu';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Orientation from 'react-native-orientation-locker';
import { PortalProvider } from '@gorhom/portal';
import NavigationService, {
  setTopLevelNavigator,
} from './src/navigation/NavigationService';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
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

import receiveShareService from './src/common/services/receive-share.service';
import appInitManager from './AppInitManager';
import { WCContextProvider } from './src/blockchain/v2/walletconnect/WalletConnectContext';
import AppMessageProvider from 'AppMessageProvider';
import ExperimentsProvider from 'ExperimentsProvider';
import { CODE_PUSH_KEY } from '~/config/Config';
import 'react-native-image-keyboard';
import FriendlyCaptchaProvider, {
  setFriendlyCaptchaReference,
} from '~/common/components/friendly-captcha/FriendlyCaptchaProvider';
import RNEventSource from './RNEventSource';

YellowBox.ignoreWarnings(['']);

appInitManager.initializeServices();

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
  ShareReceiveListener;

  constructor(props) {
    super(props);
    Orientation.lockToPortrait();

    if (!RefreshControl.defaultProps) {
      RefreshControl.defaultProps = {};
    }
    RefreshControl.defaultProps.tintColor = ThemedStyles.getColor('IconActive');
    RefreshControl.defaultProps.colors = [ThemedStyles.getColor('IconActive')];

    // Check for codepush update and restart app immediately if necessary
    codePush.sync(
      CODE_PUSH_KEY
        ? {
            installMode: codePush.InstallMode.ON_NEXT_RESTART, // install updates on app restart
            deploymentKey: CODE_PUSH_KEY,
          }
        : {
            mandatoryInstallMode: codePush.InstallMode.IMMEDIATE, // install mandatory updates immediately
          },
    );
  }

  /**
   * On component did mount
   */
  componentDidMount() {
    // Register event listeners
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    Linking.addEventListener('url', this.handleOpenURL);
    this.ShareReceiveListener = ShareMenu.addNewShareListener(
      receiveShareService.handle,
    );

    // set global audio settings for the app
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      staysActiveInBackground: true,
    });
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    Linking.removeEventListener('url', this.handleOpenURL);
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
      <ExperimentsProvider>
        <SafeAreaProvider>
          {sessionService.ready && (
            <NavigationContainer
              ref={setTopLevelNavigator}
              theme={ThemedStyles.navTheme}
              onReady={appInitManager.onNavigatorReady}
              onStateChange={NavigationService.onStateChange}>
              <StoresProvider>
                <Provider key="app" {...stores}>
                  <AppMessageProvider key={`message_${ThemedStyles.theme}`}>
                    <FriendlyCaptchaProvider ref={setFriendlyCaptchaReference}>
                      <PortalProvider>
                        <BottomSheetModalProvider>
                          <ErrorBoundary
                            message="An error occurred"
                            containerStyle={ThemedStyles.style.centered}>
                            <WCContextProvider>
                              <Notifications
                                userId={'1234'}
                                messageReceived={({ data }) => {
                                  console.log(JSON.parse(data));
                                }}
                              />
                              <NavigationStack
                                key={ThemedStyles.theme + i18n.locale}
                              />
                            </WCContextProvider>
                          </ErrorBoundary>
                        </BottomSheetModalProvider>
                      </PortalProvider>
                    </FriendlyCaptchaProvider>
                  </AppMessageProvider>
                </Provider>
              </StoresProvider>
            </NavigationContainer>
          )}
        </SafeAreaProvider>
      </ExperimentsProvider>
    );
  }
}

export default App;

if (__DEV__) {
  require('tron');
}

const BACKEND = 'http://localhost:3000/sse';

type NotificationsProps = {
  userId: string;
  messageReceived?: (message: Message) => void;
};

type Message = {
  data?: string;
  lastEventId?: string;
  origin?: string;
};

function Notifications(props: NotificationsProps): JSX.Element {
  const [appState, setAppState] = useState(AppState.currentState);
  const eventSource = useRef<RNEventSource>();
  const streamStarted = useRef<boolean>();

  useEffect(() => {
    AppState.addEventListener('change', nextAppState => {
      const inactive = /inactive|background/;
      const active = /active/;
      if (appState.match(inactive) && nextAppState.match(active)) {
        startStream();
      }
      if (appState.match(active) && nextAppState.match(inactive)) {
        endStream();
      }
      setAppState(nextAppState);
    });
    startStream();

    return () => {
      endStream();
    };
  }, [appState, startStream]);

  const requestStreamWithBackend = (userId: string) =>
    new RNEventSource(`${BACKEND}/${userId}`);

  const startStream = useCallback(() => {
    if (streamStarted.current) {
      return;
    }
    try {
      const { userId, messageReceived } = props;
      eventSource.current = requestStreamWithBackend(userId);
      eventSource.current.addEventListener('message', message => {
        messageReceived?.(message);
      });
      streamStarted.current = true;
    } catch (e) {
      console.log('startstream error', e);
    }
  }, [props]);

  const endStream = () => {
    // if (!eventSource.current) {
    //   return;
    // }
    eventSource.current?.removeAllListeners();
    eventSource.current?.close();
    streamStarted.current = false;
  };

  return null;
}
