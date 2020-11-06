import React, { useCallback } from 'react';
import { ActivityFullScreenParamList } from '../navigation/NavigationTypes';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
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
import { useStores } from '../common/hooks/use-stores';

type ActivityFullScreenRouteProp = RouteProp<
  ActivityFullScreenParamList,
  'PortraitViewerScreen'
>;
type ActivityFullScreenNavProp = NavigationProp<
  ActivityFullScreenParamList,
  'PortraitViewerScreen'
>;

type PropsType = {
  route: ActivityFullScreenRouteProp;
  navigation: ActivityFullScreenNavProp;
};

const metadataService = new MetadataService();
metadataService.setSource('portrait').setMedium('feed');

// transition angle
const ANGLE = 0.5;

const clamp = { next: 1, prev: 1 };
const stackConfig: iPageInterpolation = {
  transform: [
    {
      perspective: {
        inputRange: [-1, 0, 1],
        outputRange: [1000, 1000, 1000],
      },
      rotateY: {
        inputRange: [-1, -0.4, 0, 0.4, 1],
        outputRange: [-ANGLE, -ANGLE, 0, ANGLE, ANGLE],
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

/**
 * Portrait content swiper
 */
const PortraitViewerScreen = observer((props: PropsType) => {
  // global portrait store
  const portraitStore = useStores().portrait;

  const store = useLocalStore(() => ({
    unseenMode: portraitStore.items[props.route.params.index].unseen,
    index: props.route.params.index,
    items: portraitStore.items,
    setIndex(v) {
      store.index = v;
      if (!store.items[store.index].unseen) {
        this.unseenMode = false;
      }
    },
    prevIndex() {
      if (store.index > 0) {
        store.index = store.index - 1;
      }
    },
    nextIndex() {
      if (store.unseenMode) {
        const nextUnseen = store.items
          .slice(store.index + 1)
          .findIndex((user) => user.unseen);

        if (nextUnseen !== -1) {
          store.index = store.index + nextUnseen + 1;
        } else {
          const prevUnseen = store.items
            .slice(0, store.index)
            .findIndex((user) => user.unseen);
          if (prevUnseen !== -1) {
            store.index = prevUnseen;
          } else {
            props.navigation.goBack();
          }
        }
      } else {
        if (store.index < store.items.length - 1) {
          store.index = store.index + 1;
        } else {
          props.navigation.goBack();
        }
      }
    },
  }));

  useFocusEffect(
    useCallback(() => {
      // resort data when unfocused
      return () => portraitStore.sort();
    }, [portraitStore]),
  );

  const { width, height } = useDimensions().window;

  const pagerStyle: any = {
    height: height - (StatusBar.currentHeight || 0),
    width,
    backgroundColor: ThemedStyles.theme
      ? 'black'
      : ThemedStyles.getColor('tertiary_background'),
    alignSelf: 'center',
  };

  const pages = store.items.map((item, index) => (
    <UserContentSwiper
      key={index}
      item={item}
      nextUser={store.nextIndex}
      prevUser={store.prevIndex}
      unseenMode={store.unseenMode}
    />
  ));

  return (
    <PagerProvider activeIndex={store.index} onChange={store.setIndex}>
      <Pager
        adjacentChildOffset={1}
        maxIndex={store.items.length - 1}
        style={pagerStyle}
        clamp={clamp}
        pageInterpolation={stackConfig}
        initialIndex={store.index}>
        {pages}
      </Pager>
    </PagerProvider>
  );
});

export default PortraitViewerScreen;
