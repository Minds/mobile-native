import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useRef } from 'react';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { FeedStoreContext } from '~/common/contexts/feed-store.context';
import FeedStore from '~/common/stores/FeedStore';
import Activity from '~/newsfeed/activity/Activity';
import {
  boostRotatorMetadata,
  useBoostRotatorStore,
} from '../boost-rotator.store';
import { View } from 'react-native';
import ActivityPlaceHolder from '~/newsfeed/ActivityPlaceHolder';
import { getMaxFeedWidth } from '~/styles/Style';

function BoostRotatorCarousel() {
  const navigation = useNavigation();
  const boostRotatorStore = useBoostRotatorStore();
  const ref = React.useRef<ICarouselInstance>(null);
  // this is only used to provide the metadata to the activity analytics context
  const feedStore = useRef(
    new FeedStore().setMetadata(boostRotatorMetadata),
  ).current;

  const width = getMaxFeedWidth();
  const height = Math.max(width, 500);

  const activityHeight = height - 175;
  const renderItem = useCallback(
    itemProps => (
      <Activity
        entity={itemProps.item}
        maxContentHeight={
          itemProps.item?.goal_button_text
            ? activityHeight - BOOST_CTA_HEIGHT
            : activityHeight
        }
        autoHeight
        navigation={navigation}
        borderless
        displayBoosts="none"
      />
    ),
    [navigation, activityHeight],
  );

  const placeholderContainer = {
    height,
    maxWidth: width,
  };

  return (
    <FeedStoreContext.Provider value={feedStore}>
      {boostRotatorStore.activites.length === 0 ? (
        <View style={placeholderContainer}>
          <ActivityPlaceHolder showText />
        </View>
      ) : (
        <Carousel
          loop
          ref={ref}
          vertical={false}
          windowSize={WINDOW_SIZE}
          defaultIndex={0}
          pagingEnabled
          onSnapToItem={boostRotatorStore.setActiveIndex}
          panGestureHandlerProps={gestureHandlerProps}
          enabled={!!boostRotatorStore.activites.length}
          width={width}
          height={height}
          data={boostRotatorStore.activites}
          renderItem={renderItem}
          scrollAnimationDuration={350}
        />
      )}
    </FeedStoreContext.Provider>
  );
}

/**
 * the max height of the CTA
 */
const BOOST_CTA_HEIGHT = 45;
/**
 * the number of activities to render at any time
 */
const WINDOW_SIZE = 3;
const gestureHandlerProps = {
  cancelsTouchesInView: true,
  activeOffsetX: [-10, 10] as [number, number],
};

export default observer(BoostRotatorCarousel);
