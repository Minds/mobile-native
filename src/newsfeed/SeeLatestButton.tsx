import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import Animated, { FadeInUp, useAnimatedStyle } from 'react-native-reanimated';
import { useFeedListContext } from '~/common/components/FeedListSticky';
import i18nService from '~/common/services/i18n.service';
import { Button, Icon } from '~/common/ui';
import { IS_IOS, NEWSFEED_NEW_POST_POLL_INTERVAL } from '~/config/Config';
import useApiFetch from '../common/hooks/useApiFetch';

interface SeeLatestButtonProps {
  onPress?: () => Promise<void>;
  countEndpoint: string;
}

const additionalTop = IS_IOS ? 160 : 150;

/**
 * A prompt that appears in a feed and shows how many new posts are there
 */
const SeeLatestButton = ({ onPress, countEndpoint }: SeeLatestButtonProps) => {
  const context = useFeedListContext();
  const { count, resetCount } = useWatchForUpdates(countEndpoint);
  const scrollY = context?.scrollY;
  const style = useAnimatedStyle(() => {
    const margin = additionalTop - (IS_IOS ? 70 : 60);
    let translateY = scrollY
      ? scrollY.value < margin
        ? scrollY.value
        : margin
      : 0;

    return {
      top: additionalTop - translateY,
      position: 'absolute',
      left: 0,
      right: 0,
    };
  });
  const handleOnPress = () => onPress?.().then(() => resetCount());

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
        icon={<Icon name="arrow-up" color="White" size="small" />}
        onPress={handleOnPress}
        shouldAnimateChanges={false}>
        {i18nService.t('newsfeed.seeLatestTitle', {
          count,
        })}
      </Button>
    </Animated.View>
  );
};

export default observer(SeeLatestButton);

const useWatchForUpdates = (countEndpoint: string) => {
  const previousCount = useRef<number>();
  const [count, setCount] = useState<number>();
  const newPostInterval = useRef<any>();
  const { fetch: fetchCount } = useApiFetch<{ count: number }>(countEndpoint, {
    skip: true,
  });

  useEffect(() => {
    clearInterval(newPostInterval.current);
    setCount(0);
    previousCount.current = 0;
    newPostInterval.current = setInterval(async () => {
      const data = await fetchCount();
      if (previousCount.current && data.count) {
        setCount(data.count - previousCount.current);
      } else {
        previousCount.current = data.count;
      }
    }, NEWSFEED_NEW_POST_POLL_INTERVAL);

    return () => clearInterval(newPostInterval.current);
  }, [fetchCount]);

  return {
    count: count && count > 0 ? count : 0,
    resetCount: () => setCount(undefined),
  };
};
