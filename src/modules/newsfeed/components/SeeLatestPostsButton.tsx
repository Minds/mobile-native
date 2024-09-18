import React from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Button, Icon } from '~/common/ui';
import { useSeeLatestStyle } from '~/newsfeed/SeeLatestButton';
import useApiQuery from '~/services/hooks/useApiQuery';
import { NEWSFEED_NEW_POST_POLL_INTERVAL } from '~/config/Config';
import sp from '~/services/serviceProvider';

interface SeeLatestPostsButtonProps {
  onPress: () => void;
  countEndpoint: string;
  lastFetch: number;
}

/**
 * A prompt that appears in a feed and shows how many new posts are there
 */
const SeeLatestPostsButton = ({
  onPress,
  countEndpoint,
  lastFetch,
}: SeeLatestPostsButtonProps) => {
  const count = useWatchForUpdates(countEndpoint, lastFetch);
  const style = useSeeLatestStyle(count);

  if (!count) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      entering={FadeInUp.mass(0.3).duration(500)}
      style={style}>
      <Button
        align="center"
        type="action"
        mode="solid"
        size="small"
        // eslint-disable-next-line react/no-unstable-nested-components
        icon={color => <Icon name="arrow-up" color={color} size="small" />}
        onPress={onPress}
        shouldAnimateChanges={false}>
        {sp.i18n.t('newsfeed.seeLatestTitle', {
          count,
        })}
      </Button>
    </Animated.View>
  );
};
export default SeeLatestPostsButton;

function useWatchForUpdates(endpoint: string, lastFetch: number) {
  const query = useApiQuery<{ count: number }>(
    ['newsfeed', lastFetch],
    endpoint,
    { from_timestamp: lastFetch },
    'get',
    {
      //@ts-ignore type error in react query
      refetchInterval: NEWSFEED_NEW_POST_POLL_INTERVAL,
      retry: 0,
      refetchOnWindowFocus: true,
      cacheTime: 0,
      initialData,
    },
  );

  return query.data?.count || 0;
}

const initialData = { count: 0 };
