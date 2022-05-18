import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18nService from '~/common/services/i18n.service';
import FeedStore from '~/common/stores/FeedStore';
import { Button, Icon } from '~/common/ui';
import { IS_IOS } from '~/config/Config';
import ThemedStyles from '~/styles/ThemedStyles';

interface SeeLatestPostsButtonProps {
  onPress: () => void;
  feedStore: FeedStore;
}

const additionalTop = IS_IOS ? 110 : 90;

/**
 * A prompt that appears in a feed and shows how many new posts are there
 */
const SeeLatestPostsButton = ({
  feedStore,
  onPress,
}: SeeLatestPostsButtonProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const disposeWatcher = feedStore.watchForUpdates(() =>
      navigation.isFocused(),
    );

    return () => disposeWatcher();
  }, [feedStore, navigation]);

  if (!feedStore.newPostsCount) {
    return null;
  }

  console.log(insets.top);

  return (
    <Animated.View
      entering={FadeInUp.mass(0.3).duration(500)}
      style={[
        ThemedStyles.style.positionAbsolute,
        { top: insets.top + additionalTop },
      ]}>
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
