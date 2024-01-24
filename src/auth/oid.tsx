import { useState } from 'react';
import CloseableModal from '~/common/components/CloseableModal';
import { useFetchOidcProvidersQuery } from '~/graphql/api';
import { Cookies, cookieService } from '~/common/services/cookies.service';
import apiService from '~/common/services/api.service';

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
  const onSetCookie = async (cookies: Cookies) => {
    setVisible(false);
    console.log('onSetCookie', cookies);
    await cookieService.setFromCookies(cookies);
    const newCookies = await cookieService.getAll();
    console.log('newCookies', newCookies);
    const xsrfToken = newCookies?.['XSRF-TOKEN']?.value;
    // const mindsSess = cookies?.minds_sess?.value;
    await apiService.setXsrfToken(xsrfToken);
    const response = await apiService.get('api/v1/minds/config', {}, null, {
      // Cookie: `XSRF-TOKEN=${xsrfToken};minds_sess=${mindsSess}`,
    });
    cookieService.getAll().then(console.log);
    console.log('response', response);
  };
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
  const WebView = require('react-native-webview').WebView;
  const [redirecting, setRedirecting] = useState(false);
  const { hostname: baseHostName } = new URL(uri);
  return (
    <CloseableModal
      isVisible={isVisible}
      coverScreen={false}
      onCloseButtonPress={onCloseButtonPress}
      closeButtonPosition={'right'}>
      <WebView
        source={{ uri }}
        sharedCookiesEnabled
        onLoad={async ({ nativeEvent: { url } }) => {
          const { hostname } = new URL(url);
          const cookies = await cookieService.get();
          if (baseHostName === hostname) {
            if (!redirecting) {
              setRedirecting(true);
              onSetCookie?.(cookies);
            }
          }
        }}
      />
    </CloseableModal>
  );
};
