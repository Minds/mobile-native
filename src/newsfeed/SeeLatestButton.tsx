import { observer } from 'mobx-react';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Animated, { FadeInUp, useAnimatedStyle } from 'react-native-reanimated';
import { useFeedListContext } from '~/common/components/FeedListSticky';
import i18nService from '~/common/services/i18n.service';
import { Button, Icon } from '~/common/ui';
import { IS_IOS } from '~/config/Config';
import useApiFetch from '../common/hooks/useApiFetch';

interface SeeLatestButtonProps {
  onPress?: () => Promise<void>;
  countEndpoint: string;
}

export interface SeeLatestButtonHandle {
  /**
   * Checks for updates from server and updates the count
   * @returns count
   */
  checkForUpdates: () => Promise<number>;
}

const additionalTop = IS_IOS ? 160 : 150;

/**
 * A prompt that appears in a feed and shows how many new posts are there
 */
const SeeLatestButton: ForwardRefRenderFunction<
  SeeLatestButtonHandle,
  SeeLatestButtonProps
> = ({ onPress, countEndpoint }, ref) => {
  const context = useFeedListContext();
  const { count, resetCount, checkForUpdates } = useWatchForUpdates(
    countEndpoint,
  );
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

  useImperativeHandle(ref, () => ({
    checkForUpdates,
  }));

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

export default observer(forwardRef(SeeLatestButton));

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

  const checkForUpdates = async () => {
    const data = await fetchCount();
    if (previousCount.current && data.count) {
      setCount(data.count - previousCount.current);
    } else {
      previousCount.current = data.count;
    }

    return data.count;
  };

  useEffect(() => {
    checkForUpdates();
  });

  return {
    count: count && count > 0 ? count : 0,
    resetCount,
    checkForUpdates,
  };
};
