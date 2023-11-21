import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react-native';
import { observer } from 'mobx-react';
import { useMemo } from 'react';
import mindsConfigService from '~/common/services/minds-config.service';

export const ConfigProvider = observer(({ children }) => {
  const API_KEY = mindsConfigService.getSettings()?.livepeer_api_key;

  const client = useMemo(
    () =>
      createReactClient({
        provider: studioProvider({
          apiKey: API_KEY,
        }),
      }),
    [API_KEY],
  );

  return <LivepeerConfig client={client}>{children}</LivepeerConfig>;
});
