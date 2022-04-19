import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import WebView from 'react-native-webview';
import { MINDS_API_URI } from '~/config/Config';
import html from './html';

interface FriendlyCaptchaProps {
  onSolved: (solution: string) => void;
  onError?: (error: string) => void;
}

const webViewSource = {
  html,
  baseUrl: MINDS_API_URI,
};

const whiteListAll = ['*'];

/**
 * Friendly captcha component using a webview
 */
function FriendlyCaptcha({ onSolved, onError }: FriendlyCaptchaProps) {
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

  return (
    <WebView
      // forceDarkOn
      // style={{ backgroundColor: 'transparent' }}
      source={webViewSource}
      originWhitelist={whiteListAll}
      scrollEnabled={false}
      overScrollMode={'never'}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      sharedCookiesEnabled
      textInteractionEnabled={false}
      onMessage={onMessage}
    />
  );
}

export default observer(FriendlyCaptcha);
