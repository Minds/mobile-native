import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Activity from '../../activity/Activity';
import { useBoostRotatorStore } from '../boost-rotator.store';

const HEIGHT = 500;

function BoostRotatorCarousel() {
  const navigation = useNavigation();
  const boostRotatorStore = useBoostRotatorStore();
  const ref = React.useRef<ICarouselInstance>(null);
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
      width={width}
      height={HEIGHT}
      data={boostRotatorStore.activites}
      renderItem={renderItem}
      scrollAnimationDuration={350}
    />
  );
}

export default observer(BoostRotatorCarousel);
