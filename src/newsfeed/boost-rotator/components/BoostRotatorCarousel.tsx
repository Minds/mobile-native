import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useRef } from 'react';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { FeedStoreContext } from '~/common/contexts/feed-store.context';
import FeedStore from '~/common/stores/FeedStore';
import Activity from '~/newsfeed/activity/Activity';
import {
  boostRotatorMetadata,
  useBoostRotatorStore,
} from '../boost-rotator.store';

const HEIGHT = 500;

function BoostRotatorCarousel() {
  const navigation = useNavigation();
  const boostRotatorStore = useBoostRotatorStore();
  const ref = React.useRef<ICarouselInstance>(null);
  // this is only used to provide the metadata to the activity analytics context
  const feedStore = useRef(new FeedStore().setMetadata(boostRotatorMetadata))
    .current;
  const { width } = useSafeAreaFrame();

  const renderItem = useCallback(
    itemProps => (
      <Activity
        entity={itemProps.item}
        maxContentHeight={HEIGHT - 175}
        autoHeight
        navigation={navigation}
        borderless
      />
    ),
    [navigation],
  );

  return (
    <FeedStoreContext.Provider value={feedStore}>
      <Carousel
        loop
        ref={ref}
        vertical={false}
        windowSize={3}
        defaultIndex={0}
        pagingEnabled
        onSnapToItem={boostRotatorStore.setActiveIndex}
        panGestureHandlerProps={{
          cancelsTouchesInView: true,
          activeOffsetX: [-10, 10],
        }}
        enabled={!!boostRotatorStore.activites.length}
        width={width}
        height={HEIGHT}
        data={boostRotatorStore.activites}
        renderItem={renderItem}
        scrollAnimationDuration={350}
      />
    </FeedStoreContext.Provider>
  );
}

export default observer(BoostRotatorCarousel);
