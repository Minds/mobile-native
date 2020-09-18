import React, { useCallback } from 'react';
import { ActivityFullScreenParamList } from '../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { useLocalStore, observer } from 'mobx-react';
import {
  Pager,
  PagerProvider,
  iPageInterpolation,
  useOnFocus,
} from '@crowdlinker/react-native-pager';

import ActivityFullScreen from '../discovery/v2/viewer/ActivityFullScreen';
import {
  StatusBar,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import portraitContentService from './PortraitContentService';
import Viewed from '../common/stores/Viewed';
import MetadataService from '../common/services/metadata.service';
import PortraitPaginator from './PortraitPaginator';
import { PortraitBarItem } from './createPortraitStore';

type ActivityFullScreenRouteProp = RouteProp<
  ActivityFullScreenParamList,
  'PortraitViewerScreen'
>;

type PropsType = {
  item: PortraitBarItem;
  nextUser: Function;
};

const metadataService = new MetadataService();
metadataService.setSource('portrait').setMedium('feed');

const { width, height } = Dimensions.get('window');

/**
 * User content swiper
 */
const UserContentSwiper = observer((props: PropsType) => {
  const activities = props.item.activities;
  const firstUnseen = activities.findIndex((a) => !a.seen);

  const store = useLocalStore(() => ({
    index: firstUnseen !== -1 ? firstUnseen : 0,
    viewed: new Viewed(),
    setIndex(v) {
      if (v < 0 || v >= activities.length) {
        return;
      }
      store.index = v;
      portraitContentService.seen(activities[store.index].urn);
      activities[store.index].seen = true;
      store.viewed.addViewed(activities[store.index], metadataService);
    },
  }));

  useOnFocus(() => {
    store.viewed.addViewed(activities[store.index], metadataService);
    portraitContentService.seen(activities[store.index].urn);
    activities[store.index].seen = true;
  });

  const pagerStyle: any = {
    height: height - (StatusBar.currentHeight || 0),
    width,
    backgroundColor: ThemedStyles.theme
      ? 'black'
      : ThemedStyles.getColor('tertiary_background'),
    alignSelf: 'center',
  };

  const stackConfig: iPageInterpolation = {
    opacity: {
      inputRange: [-1, 0, 1],
      outputRange: [0, 1, 0],
    },
  };

  const onTapStateChange = useCallback(
    ({ nativeEvent }) => {
      const halfWidth = width / 2;
      if (nativeEvent.pageX < halfWidth) {
        if (store.index > 0) {
          store.setIndex(store.index - 1);
        }
      } else if (store.index < activities.length - 1) {
        store.setIndex(store.index + 1);
      } else {
        props.nextUser();
      }
    },
    [activities.length, store, props],
  );

  const pages = activities.map((e, i) => (
    <ActivityFullScreen key={i} entity={e} />
  ));

  return (
    <PagerProvider activeIndex={store.index} onChange={store.setIndex}>
      <View>
        <Pager
          adjacentChildOffset={1}
          maxIndex={activities.length - 1}
          panProps={{ enabled: false }}
          style={pagerStyle}
          clamp={{ next: 0, prev: 0 }}
          pageInterpolation={stackConfig}
          initialIndex={store.index}>
          {pages}
        </Pager>
        <PortraitPaginator store={store} pages={pages} />
      </View>
      <TouchableOpacity style={styles.touch} onPress={onTapStateChange} />
    </PagerProvider>
  );
});

export default UserContentSwiper;

const styles = StyleSheet.create({
  touch: {
    position: 'absolute',
    top: height / 3,
    height: height / 3,
    left: 0,
    width: '100%',
  },
});
