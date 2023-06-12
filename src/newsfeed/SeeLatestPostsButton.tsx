import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import i18nService from '~/common/services/i18n.service';
import FeedStore from '~/common/stores/FeedStore';
import { Button, Icon } from '~/common/ui';
import { useSeeLatestStyle } from './SeeLatestButton';

interface SeeLatestPostsButtonProps {
  onPress: () => void;
  feedStore: FeedStore;
}

/**
 * A prompt that appears in a feed and shows how many new posts are there
 */
const SeeLatestPostsButton = ({
  feedStore,
  onPress,
}: SeeLatestPostsButtonProps) => {
  const navigation = useNavigation();
  const style = useSeeLatestStyle(feedStore.newPostsCount);

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
        {i18nService.t('newsfeed.seeLatestTitle', {
          count: feedStore.newPostsCount,
        })}
      </Button>
    </Animated.View>
  );
};

export default observer(SeeLatestPostsButton);
