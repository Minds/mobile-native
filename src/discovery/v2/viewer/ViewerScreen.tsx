import React, { useEffect } from 'react';
import { ActivityFullScreenParamList } from '../../../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { useLocalStore, observer } from 'mobx-react';
import {
  Pager,
  PagerProvider,
  iPageInterpolation,
} from '@msantang78/react-native-pager';

import ActivityFullScreen from './ActivityFullScreen';
import type FeedStore from '../../../common/stores/FeedStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import SwipeAnimation from '../../../common/components/animations/SwipeAnimation';
import SettingsStore from '../../../settings/SettingsStore';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

type ActivityFullScreenRouteProp = RouteProp<
  ActivityFullScreenParamList,
  'ActivityFullScreen'
>;

type PropsType = {
  route: ActivityFullScreenRouteProp;
};

const ViewerScreen = observer((props: PropsType) => {
  const feedStore = props.route.params.feed as FeedStore;
  const showAnim = !SettingsStore.swipeAnimShown;
  const { width, height } = useSafeAreaFrame();
  const store = useLocalStore(() => ({
    index: props.route.params.current || 0,
    setIndex(v) {
      // if going forward and only 3 more posts left try to load more
      if (
        v > store.index &&
        feedStore.entities.length - v < 4 &&
        feedStore.feedsService.hasMore
      ) {
        feedStore.loadMore();
      }

      store.index = v;

      // report viewed with metadata
      feedStore.entities[store.index].sendViewed('single');
    },
  }));

  useEffect(() => {
    feedStore.viewed.clearViewed();
    // report initial as viewed with metadata
    feedStore.entities[store.index].sendViewed('single');
    return () => {
      feedStore.viewed.clearViewed();
      if (!SettingsStore.swipeAnimShown) {
        SettingsStore.setSwipeAnimShown(true);
      }
    };
  }, [feedStore, store]);

  const translationX = width * 0.13;

  const pagerStyle: any = {
    height,
    width,
    backgroundColor: ThemedStyles.theme
      ? 'black'
      : ThemedStyles.getColor('TertiaryBackground'),
    alignSelf: 'center',
  };

  const stackConfig: iPageInterpolation = {
    opacity: {
      inputRange: [-1, -0.8, 0, 0.8, 1],
      outputRange: [0, 1, 1, 1, 0],
    },
    transform: [
      {
        // { perspective: 400 },
        perspective: {
          inputRange: [-1, 0, 1],
          outputRange: [1000, 1000, 1000],
        },
        rotateY: {
          inputRange: [-1, 0, 1],
          outputRange: [0.5, 0, -0.5],
        },
        scale: {
          inputRange: [-1, 0, 1],
          outputRange: [0.8, 1, 0.8],
        },

        translateX: {
          inputRange: [-1, -0.07, 0, 0.07, 1],
          outputRange: [
            translationX,
            translationX * 0.5,
            0,
            -translationX * 0.5,
            -translationX,
          ],
        },
      },
    ],
  };

  return (
    <PagerProvider activeIndex={store.index} onChange={store.setIndex}>
      <Pager
        adjacentChildOffset={1}
        maxIndex={feedStore.entities.length - 1}
        style={pagerStyle}
        pageInterpolation={stackConfig}
        initialIndex={store.index}>
        {feedStore.entities.map((e, i) => (
          <ActivityFullScreen key={i} entity={e} showCommentsOnFocus={true} />
        ))}
      </Pager>
      {showAnim && <SwipeAnimation style={swipeStyle} autoPlay={true} />}
    </PagerProvider>
  );
});

const swipeStyle = { width: '100%', height: 200 };

export default ViewerScreen;
