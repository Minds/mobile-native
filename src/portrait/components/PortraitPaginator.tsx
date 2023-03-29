import { observer } from 'mobx-react';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useElapsedTime } from 'use-elapsed-time';
import type ActivityModel from '~/newsfeed/ActivityModel';
import { useCarouselFocus } from '../PortraitViewerScreen';
import { useLayout } from '@react-native-community/hooks';

type PropsType = {
  store: {
    setIndex: (number) => void;
    index: number;
    next: () => void;
    videoProgress?: number;
  };
  activities: Array<ActivityModel>;
};

/**
 * Portrait paginator
 */
function PortraitPaginator({ store, activities }: PropsType) {
  const insets = useSafeAreaInsets();
  const focused = useCarouselFocus();

  const style = StyleSheet.flatten([
    styles.circlesContainer,
    { marginTop: insets.top ? insets.top : 0 },
  ]);

  return (
    <View style={style}>
      {activities.map((entity, i) =>
        store.index === i && focused ? (
          <ProgressBar
            key={i}
            isVideo={entity.hasVideo()}
            videoProgress={store.videoProgress}
            store={store}
            onComplete={() => {
              store.next();
            }}
          />
        ) : (
          <View
            style={[
              styles.marker,
              i > store.index ? styles.dark : styles.light,
              store.index === i ? styles.dark : null,
            ]}
          />
        ),
      )}
    </View>
  );
}

const ProgressBar = observer(({ onComplete, store }) => {
  const duration = 5;
  const { elapsedTime: progress } = useElapsedTime({
    isPlaying: store.playing,
    duration,
    onComplete,
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View
        style={[
          styles.marker,
          styles.light,
          styles.current,
          {
            width: `${Math.ceil((progress / duration) * 100)}%`,
          },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  light: {
    backgroundColor: '#FFFFFF',
  },
  dark: {
    backgroundColor: '#000000',
  },
  current: {
    opacity: 0.9,
  },
  markerContainer: {
    marginHorizontal: 3,
    flex: 1,
  },
  marker: {
    flex: 1,
    marginHorizontal: 2,
    opacity: 0.4,
    height: 5,
    borderRadius: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  circlesContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: Platform.select({ ios: 10, android: 20 }),
    left: 0,
    height: 8,
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 9999,
  },
  progressBarContainer: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    flex: 1,
    height: 5,
    width: '100%',
  },
});
