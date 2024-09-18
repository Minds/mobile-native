import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { Button, Icon } from '~/common/ui';
import { IS_IOS, NEWSFEED_NEW_POST_POLL_INTERVAL } from '~/config/Config';
import {
  ScrollDirection,
  useScrollContext,
} from '~/common/contexts/scroll.context';
import useApiFetch from '../common/hooks/useApiFetch';
import { Timeout } from '../types/Common';
import sp from '~/services/serviceProvider';

interface SeeLatestButtonProps {
  onPress?: () => Promise<void>;
  countEndpoint: string;
}

const additionalTop = 163;
const DISMISS_TIMEOUT = 5000;
const TOP_HIDDEN_OFFSET = -500;

/**
 * A prompt that appears in a feed and shows how many new posts are there
 */
const SeeLatestButton = ({ onPress, countEndpoint }: SeeLatestButtonProps) => {
  const { count, resetCount } = useWatchForUpdates(countEndpoint);
  const style = useSeeLatestStyle(count, 170);
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
        // eslint-disable-next-line react/no-unstable-nested-components
        icon={color => <Icon name="arrow-up" color={color} size="small" />}
        onPress={handleOnPress}
        shouldAnimateChanges={false}>
        {sp.i18n.t('newsfeed.seeLatestTitle', {
          count,
        })}
      </Button>
    </Animated.View>
  );
};

export default observer(SeeLatestButton);

export const useSeeLatestStyle = (count: number, top?: number) => {
  const context = useScrollContext();
  const {
    scrollY = { value: 0 },
    translationY = { value: 0 },
    scrollDirection = { value: 0 },
  } = context ?? {};
  const topDistance = top || additionalTop;
  const [dismissible, setDismissible] = useState(false);
  const countAvailable = !!count;
  const timeOutRef = useRef<Timeout>();

  const dismissed = useDerivedValue(() => {
    return dismissible && scrollDirection.value === ScrollDirection.down;
  }, [scrollDirection, dismissible]);

  useEffect(() => {
    if (countAvailable) {
      timeOutRef.current = setTimeout(() => {
        setDismissible(true);
      }, DISMISS_TIMEOUT);
    } else {
      setDismissible(false);
    }

    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, [countAvailable]);

  return useAnimatedStyle(() => {
    const margin = topDistance - (IS_IOS ? 70 : 65);

    let translateY = scrollY
      ? scrollY.value < margin
        ? scrollY.value
        : margin + translationY.value
      : 0;

    return {
      top: withTiming(
        dismissed.value ? TOP_HIDDEN_OFFSET : topDistance - translateY,
        {
          duration: 300,
        },
      ),
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 0,
    };
  }, [dismissed]);
};

const useWatchForUpdates = (countEndpoint: string) => {
  const previousCount = useRef<number>();
  const [count, setCount] = useState<number>();
  const newPostInterval = useRef<any>();
  const { fetch: fetchCount } = useApiFetch<{ count: number }>(countEndpoint, {
    skip: true,
  });
  const resetCount = () => {
    clearInterval(newPostInterval.current);
    setCount(0);
    previousCount.current = 0;
  };

  useEffect(() => {
    resetCount();
    newPostInterval.current = setInterval(async () => {
      const data = await fetchCount();
      if (previousCount.current && data.count) {
        setCount(data.count - previousCount.current);
      } else {
        previousCount.current = data.count;
      }
    }, NEWSFEED_NEW_POST_POLL_INTERVAL);

    return () => clearInterval(newPostInterval.current);
  }, [fetchCount, countEndpoint]);

  return {
    count: count && count > 0 ? count : 0,
    resetCount,
  };
};
