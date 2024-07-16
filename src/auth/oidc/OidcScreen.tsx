import { WebView } from 'react-native-webview';
import React, { useEffect, useState } from 'react';
import { ModalFullScreen } from '~/common/ui';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { APP_URI } from '~/config/Config';
import serviceProvider from '~/services/serviceProvider';

type PropsType = {
  route: any;
};

const OidcScreen = ({ route }: PropsType) => {
  const [loginUrl, setLoginUrl] = useState('');

  // Pickup the url that we wish to login as
  useEffect(() => {
    const params = route.params;
    setLoginUrl(params.loginUrl);
  }, [route.params]);

  const onLoginComplete = async () => {
    setLoginUrl('');
    const sessionService = serviceProvider.session;
    await sessionService.addCookieSession();
    await sessionService.login();
    await serviceProvider.config.update();

    sessionService.setSwitchingAccount(false);
  };

  const [redirecting, setRedirecting] = useState(false);

  return (
    <ModalFullScreen back>
      {loginUrl ? (
        <WebView
          source={{ uri: loginUrl }}
          sharedCookiesEnabled
          onShouldStartLoadWithRequest={request => {
            if (request.url.startsWith(`${APP_URI}pages/`)) {
              serviceProvider.resolve('openURL').open(request.url);
              return false;
            }
            return true;
          }}
          onLoad={async ({ nativeEvent: { url } }) => {
            const { hostname: baseHostName } = new URL(loginUrl);
            const { hostname } = new URL(url);

            if (baseHostName === hostname) {
              if (!redirecting) {
                setRedirecting(true);

                onLoginComplete();
              }
            }
          }}
        />
      ) : (
        <></>
      )}
    </ModalFullScreen>
  );
};

export default withErrorBoundaryScreen(OidcScreen, 'OidcScreen');
