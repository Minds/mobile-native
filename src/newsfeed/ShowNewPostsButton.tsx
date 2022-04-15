import React, { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import i18nService from '~/common/services/i18n.service';
import { Button, Icon } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

const newPostsButtonStyle = ThemedStyles.combine('positionAbsolute', {
  top: Platform.select({ android: 75, ios: 70 }),
});

export const ShowNewPostsButton = ({ newsfeed }) => {
  const newPostsButtonEnteringAnimation = useMemo(
    () => FadeInUp.mass(0.3).duration(500),
    [],
  );
  const newPostsButtonExitingAnimation = useMemo(
    () => FadeInDown.mass(0.3).duration(500),
    [],
  );
  const onPress = useCallback(() => {
    newsfeed.listRef?.scrollToTop();
    newsfeed.latestFeedStore.refresh();
  }, [newsfeed.latestFeedStore, newsfeed.listRef]);

  return (
    <Animated.View
      entering={newPostsButtonEnteringAnimation}
      exiting={newPostsButtonExitingAnimation}
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
