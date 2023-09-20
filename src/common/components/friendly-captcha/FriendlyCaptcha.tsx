import { observer } from 'mobx-react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import openUrlService from '~/common/services/open-url.service';
import { MINDS_API_URI } from '~/config/Config';
import ThemedStyles from '~/styles/ThemedStyles';
import html from './html';

interface FriendlyCaptchaProps {
  onSolved: (solution: string) => void;
  onError?: (error: string) => void;
  origin?: string;
}

const webViewSource = {
  html,
  baseUrl: MINDS_API_URI,
};

const whiteListAll = ['*'];

/**
 * Friendly captcha component using a webview
 */
function FriendlyCaptcha(
  { onSolved, onError, origin }: FriendlyCaptchaProps,
  ref,
) {
  const webViewRef = useRef<any>(null);
  /**
   * receives done or error callbacks from the webview
   */
  const onMessage = useCallback(
    event => {
      try {
        const { solution, error } = JSON.parse(event.nativeEvent.data);

        if (solution) {
          onSolved(solution);
        }

        if (error) {
          onError?.(error);
        }
      } catch (e) {
        console.error('[FriendlyCaptcha] Something went wrong', e);
        onError?.(String(e));
      }
    },
    [onError, onSolved],
  );

  const reset = useCallback(
    () => webViewRef.current?.injectJavaScript('reset()'),
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      reset,
    }),
    [reset],
  );

  // reset the captcha on unmount
  useEffect(() => {
    return reset;
  }, [reset]);

  /**
   * If the webview was navigating to an external url, open it using our openUrlService
   */
  const onNavigation = useCallback(request => {
    if (!request.url.includes(MINDS_API_URI)) {
      openUrlService.open(request.url);
      return false;
    }

    return true;
  }, []);

  // lazy load
  const WebView = require('react-native-webview').WebView;

  return (
    <WebView
      ref={webViewRef}
      source={webViewSource}
      originWhitelist={whiteListAll}
      scrollEnabled={false}
      overScrollMode={'never'}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      sharedCookiesEnabled
      textInteractionEnabled={false}
      injectedJavaScript={
        `
        setTheme(${ThemedStyles.theme === 1 ? "'dark'" : "'light'"});
        ${origin ? `window.captchaOrigin = '${origin}';` : ''}
        ` as string
      }
      cacheEnabled
      onMessage={onMessage}
      style={containerStyle}
      onShouldStartLoadWithRequest={onNavigation}
    />
  );
}

const containerStyle = {
  backgroundColor: 'transparent',
  height: 60,
  width: '100%',
};

export default observer(forwardRef(FriendlyCaptcha));
