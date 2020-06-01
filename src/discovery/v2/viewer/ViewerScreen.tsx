import React, { useEffect } from 'react';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { useLocalStore, observer } from 'mobx-react';
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';

import ActivityFullScreen from './ActivityFullScreen';
import type FeedStore from '../../../common/stores/FeedStore';

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
    ready: false,
    setReady() {
      store.ready = true;
    },
    setIndex(v) {
      // if going forward and only 3 more posts left try to load more
      if (
        v > store.index &&
        feedStore.entities.length - v < 4 &&
        feedStore.feedsService.hasMore
      ) {
        console.log('LOADING MORE');
        feedStore.loadMore();
      }

      store.index = v;
    },
  }));

  // workaround to force re-render initialIndex is not correctly rendered the first time
  useEffect(() => {
    setTimeout(() => {
      store.setReady();
    }, 200);
  }, [store, props.route.params]);

  // dereference to listen observable
  store.ready;

  return (
    <PagerProvider activeIndex={store.index} onChange={store.setIndex}>
      <Pager
        adjacentChildOffset={1}
        maxIndex={feedStore.entities.length - 1}
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
