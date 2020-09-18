import React, { useEffect } from 'react';
import { ActivityFullScreenParamList } from '../../../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { useLocalStore, observer } from 'mobx-react';
import {
  Pager,
  PagerProvider,
  iPageInterpolation,
} from '@crowdlinker/react-native-pager';

import ActivityFullScreen from './ActivityFullScreen';
import type FeedStore from '../../../common/stores/FeedStore';
import { StatusBar } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import ThemedStyles from '../../../styles/ThemedStyles';
import SwipeAnimation from '../../../common/components/animations/SwipeAnimation';

type ActivityFullScreenRouteProp = RouteProp<
  ActivityFullScreenParamList,
  'ActivityFullScreen'
>;

type PropsType = {
  route: ActivityFullScreenRouteProp;
};

const ViewerScreen = observer((props: PropsType) => {
  const feedStore = props.route.params.feed as FeedStore;
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
      feedStore.addViewed(feedStore.entities[store.index]);
    },
  }));

  useEffect(() => {
    feedStore.viewed.clearViewed();
    feedStore.metadataService?.pushSource('single');
    // report initial as viewed with metadata
    feedStore.addViewed(feedStore.entities[store.index]);
    return () => {
      feedStore.viewed.clearViewed();
      feedStore.metadataService?.popSource();
    };
  }, [feedStore, store]);

  const { width, height } = useDimensions().window;
  const translationX = width * 0.13;

  const pagerStyle: any = {
    height: height - (StatusBar.currentHeight || 0),
    width,
    backgroundColor: ThemedStyles.theme
      ? 'black'
      : ThemedStyles.getColor('tertiary_background'),
    alignSelf: 'center',
  };

  const stackConfig: iPageInterpolation = {
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
          <ActivityFullScreen key={i} entity={e} />
        ))}
      </Pager>
      <SwipeAnimation style={swipeStyle} autoPlay={true} />
    </PagerProvider>
  );
});

const swipeStyle = { width: '100%', height: 200 };

export default ViewerScreen;
