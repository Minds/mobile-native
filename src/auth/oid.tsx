import { useState } from 'react';
import CloseableModal from '~/common/components/CloseableModal';
import { useFetchOidcProvidersQuery } from '~/graphql/api';
import { Cookies, cookieService } from './CookieService';
import WebView from 'react-native-webview';

type LoginWebProps = {
  uri?: string;
  isVisible: boolean;
  onCloseButtonPress: () => void;
  onSetCookie: (cookies: Cookies) => void;
};

export const useLoginWeb = (): LoginWebProps & {
  name?: string;
  showLoginWeb: () => void;
} => {
  const { data } = useFetchOidcProvidersQuery();
  const { name, loginUrl: uri } = data?.oidcProviders?.[0] ?? {};
  const [isVisible, setVisible] = useState(false);

  const onCloseButtonPress = () => setVisible(false);
  const onSetCookie = (cookies: Cookies) =>
    console.log('on getting the Cookie', cookies);
  const showLoginWeb = () => setVisible(true);

  return {
    name,
    uri,
    isVisible,
    onCloseButtonPress,
    showLoginWeb,
    onSetCookie,
  };
};

export const LoginWeb = ({
  uri = 'http://localhost',
  isVisible,
  onCloseButtonPress,
  onSetCookie,
}: LoginWebProps) => {
  // const WebView = require('react-native-webview').WebView;
  const [redirecting, setRedirecting] = useState(false);
  const { hostname: baseHostName, origin: baseUri } = new URL(uri);
  return (
    <CloseableModal
      isVisible={isVisible}
      coverScreen={false}
      onCloseButtonPress={onCloseButtonPress}
      closeButtonPosition={'right'}>
      <WebView
        source={{ uri: redirecting ? baseUri : uri }}
        sharedCookiesEnabled
        onLoad={async ({ nativeEvent: { url } }) => {
          const { hostname } = new URL(url);

          const cookies = await cookieService.getAll();
          console.log('cookieString', hostname, cookies);
          if (baseHostName === hostname) {
            if (!redirecting) {
              console.log('Redirecting to', baseUri);
              setRedirecting(true);
            } else {
              onSetCookie?.(cookies);
            }
          }
        }}
      />
    </CloseableModal>
  );
};
