import React from 'react';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
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

type ActivityFullScreenRouteProp = RouteProp<
  AppStackParamList,
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
    },
  }));

  const { width, height } = useDimensions().window;

  const pagerStyle: any = {
    height: height - (StatusBar.currentHeight || 0),
    width,
    alignSelf: 'center',
  };

  const stackConfig: iPageInterpolation = {
    transform: [
      {
        scale: {
          inputRange: [-1, 0, 1],
          outputRange: [0.85, 1, 0.85],
        },
      },
    ],
    opacity: {
      inputRange: [-1, 0, 1],
      outputRange: [0, 1, 0],
    },

    zIndex: (offset) => offset,
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
        {/* {feedStore.loading && <CenteredLoading />} */}
      </Pager>
    </PagerProvider>
  );
});

export default ViewerScreen;
