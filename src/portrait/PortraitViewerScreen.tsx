import React, { useEffect } from 'react';
import { ActivityFullScreenParamList } from '../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { useLocalStore, observer } from 'mobx-react';
import {
  Pager,
  PagerProvider,
  iPageInterpolation,
  Extrapolate,
} from '@crowdlinker/react-native-pager';

import ActivityFullScreen from '../discovery/v2/viewer/ActivityFullScreen';
import { StatusBar } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import ThemedStyles from '../styles/ThemedStyles';
import portraitContentService from './PortraitContentService';
import Viewed from '../common/stores/Viewed';
import MetadataService from '../common/services/metadata.service';
import PortraitPaginator from './PortraitPaginator';

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
  const activities = props.route.params.activities;
  const firstUnseen = activities.findIndex((a) => !a.seen);

  const store = useLocalStore(() => ({
    index: firstUnseen !== -1 ? firstUnseen : 0,
    viewed: new Viewed(),
    setIndex(v) {
      store.index = v;
      portraitContentService.seen(activities[store.index].urn);
      activities[store.index].seen = true;
      store.viewed.addViewed(activities[store.index], metadataService);
    },
  }));

  useEffect(() => {
    store.viewed.addViewed(activities[store.index], metadataService);
    portraitContentService.seen(activities[store.index].urn);
    activities[store.index].seen = true;
  }, [activities, store.index, store.viewed]);

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

  const pages = activities.map((e, i) => (
    <ActivityFullScreen key={i} entity={e} />
  ));

  return (
    <PagerProvider activeIndex={store.index} onChange={store.setIndex}>
      <Pager
        adjacentChildOffset={1}
        maxIndex={activities.length - 1}
        style={pagerStyle}
        clamp={{ next: 1, prev: 1 }}
        pageInterpolation={stackConfig}
        initialIndex={store.index}>
        {pages}
      </Pager>
      <PortraitPaginator store={store} pages={pages} />
    </PagerProvider>
  );
});

export default PortraitViewerScreen;
