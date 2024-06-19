import { WebView } from 'react-native-webview';
import React, { useEffect, useState } from 'react';
import { ModalFullScreen } from '~/common/ui';
import { sessionService } from '~/common/services';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import mindsConfigService from '~/common/services/minds-config.service';

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

    await sessionService.addCookieSession();
    await sessionService.login();
    await mindsConfigService.update();

    sessionService.setSwitchingAccount(false);
  };

  const [redirecting, setRedirecting] = useState(false);

  return (
    <ModalFullScreen back>
      {loginUrl ? (
        <WebView
          source={{ uri: loginUrl }}
          sharedCookiesEnabled
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
