import { useRoute } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { InteractionManager } from 'react-native';
import { WebViewNavigation } from 'react-native-webview';
import { showNotification } from '../../AppMessages';
import useApiFetch from '../common/hooks/useApiFetch';
import apiService from '../common/services/api.service';
import i18n from '../common/services/i18n.service';
import { B2, Button, Column, H3, Screen, ScreenHeader } from '../common/ui';
import { MINDS_URI } from '../config/Config';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

export interface SupermindTwitterConnectRouteParams {
  onConnect: (success: boolean) => void;
}

function SupermindTwitterConnectScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { onConnect } = (params || {
    onConnect: () => false,
  }) as SupermindTwitterConnectRouteParams;
  const { fetch: getRedirectUrl } = useApiFetch(
    'api/v3/twitter/request-oauth-token',
    {
      skip: true,
    },
  );

  const openTwitter = async () => {
    try {
      const { authorization_url } = await getRedirectUrl();

      return new Promise(resolve =>
        navigation.navigate('WebView', {
          url: authorization_url,
          redirectUrl: MINDS_URI + 'api/v3/twitter/oauth-callback',
          onRedirect: async (event: WebViewNavigation) => {
            resolve(true);
            await apiService.get(event.url);
            showNotification(
              i18n.t('supermind.twitterConnect.connectSuccess'),
              'success',
            );
            navigation.goBack();
            InteractionManager.runAfterInteractions(() => {
              onConnect(true);
            });
          },
        }),
      );
    } catch (e) {
      console.error(e);
      onConnect(false);
    }
  };

  return (
    <Screen safe onlyTopEdge>
      <ScreenHeader title="Supermind" back border />
      <Column space="L" flex>
        <H3 bottom="S">
          {i18n.t('supermind.twitterConnect.twitterPermission.title')}
        </H3>
        <B2>
          {i18n.t('supermind.twitterConnect.twitterPermission.description')}
        </B2>
        <Column flex />
        <Button mode="solid" type="action" onPress={openTwitter} spinner>
          {i18n.t('supermind.twitterConnect.twitterPermission.connectTwitter')}
        </Button>
      </Column>
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  SupermindTwitterConnectScreen,
  'SupermindTwitterConnectScreen',
);

interface TwitterConfigResponse {
  discoverable: boolean;
  last_imported_tweet_id: string;
  last_sync_ts: number;
  twitter_followers_count: number;
  twitter_oauth2_connected: boolean;
  twitter_user_id: string;
  twitter_username: string;
  user_guid: string;
}

/**
 * Checks whether twitter is connected or not, and tries to connect to twitter if it wasn't
 * @param navigation
 * @returns Promise<boolean> - whether twitter is connected or not
 */
export const ensureTwitterConnected = async navigation => {
  try {
    /**
     * Get twitter config
     */
    const { twitter_oauth2_connected } =
      await apiService.get<TwitterConfigResponse>('api/v3/twitter/config');

    /**
     * Open twitter connect screen if twitter wasn't connected
     */
    if (!twitter_oauth2_connected) {
      return new Promise<boolean>((resolve, reject) => {
        navigation.navigate('SupermindTwitterConnect', {
          onConnect: (success: boolean) => {
            if (success) {
              resolve(true);
            } else {
              reject(false);
            }
          },
        });
      });
    }

    return true;
  } catch (e) {
    if (e === false) {
      showNotification(
        i18n.t('supermind.twitterConnect.connectFailed'),
        'danger',
      );
      return false;
    }

    showNotification(
      i18n.t('supermind.twitterConnect.connectConfigFailed'),
      'danger',
    );
    return false;
  }
};
