import React from 'react';
import { ActivityFullScreenParamList } from '../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { useLocalStore, observer } from 'mobx-react';
import {
  Pager,
  PagerProvider,
  iPageInterpolation,
  Extrapolate,
} from '@crowdlinker/react-native-pager';

import { StatusBar } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import ThemedStyles from '../styles/ThemedStyles';
import MetadataService from '../common/services/metadata.service';
import UserContentSwiper from './UserContentSwiper';

type ActivityFullScreenRouteProp = RouteProp<
  ActivityFullScreenParamList,
  'PortraitViewerScreen'
>;

type PropsType = {
  route: ActivityFullScreenRouteProp;
};

const metadataService = new MetadataService();
metadataService.setSource('portrait').setMedium('feed');

/**
 * Portrait content swiper
 */
const PortraitViewerScreen = observer((props: PropsType) => {
  const store = useLocalStore(() => ({
    index: props.route.params.index,
    items: props.route.params.items,
    setIndex(v) {
      store.index = v;
    },
    nextIndex() {
      if (store.index < store.items.length - 1) {
        store.index = store.index + 1;
      }
    },
  }));

  const { width, height } = useDimensions().window;
  const angle = 0.5;

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
        perspective: {
          inputRange: [-1, 0, 1],
          outputRange: [1000, 1000, 1000],
        },
        rotateY: {
          inputRange: [-1, -0.4, 0, 0.4, 1],
          outputRange: [-angle, -angle, 0, angle, angle],
          extrapolate: Extrapolate.IDENTITY,
        },
        scaleY: {
          inputRange: [-1, -0.4, 0, 0.4, 1],
          outputRange: [0.9, 0.9, 1, 0.9, 0.9],
        },
      },
    ],
    zIndex: (offset) => offset,
    opacity: {
      inputRange: [-1, 0, 1],
      outputRange: [0.5, 1, 0.5],
    },
  };

  const pages = store.items.map((item, index) => (
    <UserContentSwiper key={index} item={item} nextUser={store.nextIndex} />
  ));

  return (
    <PagerProvider activeIndex={store.index} onChange={store.setIndex}>
      <Pager
        adjacentChildOffset={1}
        maxIndex={store.items.length - 1}
        style={pagerStyle}
        clamp={{ next: 1, prev: 1 }}
        pageInterpolation={stackConfig}
        initialIndex={store.index}>
        {pages}
      </Pager>
    </PagerProvider>
  );
});

export default PortraitViewerScreen;
