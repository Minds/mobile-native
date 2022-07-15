import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import Animated, { FadeInUp, useAnimatedStyle } from 'react-native-reanimated';
import { useFeedListContext } from '~/common/components/FeedListSticky';
import i18nService from '~/common/services/i18n.service';
import FeedStore from '~/common/stores/FeedStore';
import { Button, Icon } from '~/common/ui';
import { IS_IOS } from '~/config/Config';

interface SeeLatestPostsButtonProps {
  onPress: () => void;
  feedStore: FeedStore;
}

const additionalTop = IS_IOS ? 160 : 150;

/**
 * A prompt that appears in a feed and shows how many new posts are there
 */
const SeeLatestPostsButton = ({
  feedStore,
  onPress,
}: SeeLatestPostsButtonProps) => {
  const navigation = useNavigation();

  const context = useFeedListContext();

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

  useEffect(() => {
    const disposeWatcher = feedStore.watchForUpdates(() =>
      navigation.isFocused(),
    );

    return () => disposeWatcher();
  }, [feedStore, navigation]);

  if (!feedStore.newPostsCount) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      entering={FadeInUp.mass(0.3).duration(500)}
      style={style}>
      <Button
        align="center"
        type="action"
        mode="solid"
        size="small"
        icon={<Icon name="arrow-up" color="PrimaryText" size="small" />}
        onPress={onPress}
        shouldAnimateChanges={false}>
        {i18nService.t('newsfeed.seeLatestTitle', {
          count: feedStore.newPostsCount,
        })}
      </Button>
    </Animated.View>
  );
};

export default observer(SeeLatestPostsButton);
