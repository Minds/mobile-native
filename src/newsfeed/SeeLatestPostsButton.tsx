import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import i18nService from '~/common/services/i18n.service';
import { Button, Icon } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

const newPostsButtonStyle = ThemedStyles.combine('positionAbsolute', {
  top: Platform.select({ android: 75, ios: 70 }),
});

export const SeeLatestPostsButton = ({ newsfeed }) => {
  const onPress = useCallback(() => {
    newsfeed.listRef?.scrollToTop();
    newsfeed.latestFeedStore.refresh();
  }, [newsfeed.latestFeedStore, newsfeed.listRef]);

  if (!newsfeed.latestFeedStore.newPostsCount) {
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
            count: newsfeed.latestFeedStore.newPostsCount,
          })}
        </Button>
      </SafeAreaView>
    </Animated.View>
  );
};

const edges: Edge[] = ['top'];
