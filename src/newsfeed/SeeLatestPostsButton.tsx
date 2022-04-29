import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import i18nService from '~/common/services/i18n.service';
import FeedStore from '~/common/stores/FeedStore';
import { Button, Icon } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

const newPostsButtonStyle = ThemedStyles.combine('positionAbsolute', {
  top: Platform.select({ android: 75, ios: 70 }),
});

interface SeeLatestPostsButtonProps {
  onPress: () => void;
  feedStore: FeedStore;
}

/**
 * A prompt that appears in a feed and shows how many new posts are there
 */
export const SeeLatestPostsButton = ({
  feedStore,
  onPress,
}: SeeLatestPostsButtonProps) => {
  const navigation = useNavigation();
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
      entering={FadeInUp.mass(0.3).duration(500)}
      exiting={FadeInDown.mass(0.3).duration(500)}
      style={newPostsButtonStyle}>
      <SafeAreaView edges={edges}>
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
      </SafeAreaView>
    </Animated.View>
  );
};

const edges: Edge[] = ['top'];
