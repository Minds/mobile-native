import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react-native';
import { observer } from 'mobx-react';
import { useMemo } from 'react';

import sp from '~/services/serviceProvider';

export const ConfigProvider = observer(({ children }) => {
  const API_KEY = sp.config.getSettings()?.livepeer_api_key;

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
