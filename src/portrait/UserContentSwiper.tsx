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

import {
  StatusBar,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import portraitContentService from './PortraitContentService';
import Viewed from '../common/stores/Viewed';
import MetadataService from '../common/services/metadata.service';
import PortraitPaginator from './PortraitPaginator';
import { PortraitBarItem } from './createPortraitStore';
import PortraitActivity from './PortraitActivity';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ActivityFullScreenRouteProp = RouteProp<
  ActivityFullScreenParamList,
  'PortraitViewerScreen'
>;

type PropsType = {
  item: PortraitBarItem;
  nextUser: Function;
  prevUser: Function;
};

const metadataService = new MetadataService();
metadataService.setSource('portrait').setMedium('feed');

const { width, height } = Dimensions.get('window');
const panProps = { enabled: false };
const clamp = { next: 0, prev: 0 };

/**
 * User content swiper
 */
const UserContentSwiper = observer((props: PropsType) => {
  const activities = props.item.activities;
  const firstUnseen = activities.findIndex((a) => !a.seen);
  const insets = useSafeAreaInsets();

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
      inputRange: [-1, -0.5, 0, 0.5, 1],
      outputRange: [0, 1, 1, 1, 0],
    },
  };

  const onTapStateChangeRight = useCallback(() => {
    if (store.index < activities.length - 1) {
      store.setIndex(store.index + 1);
    } else {
      props.nextUser();
    }
  }, [activities.length, store, props]);

  const onTapStateChangeLeft = useCallback(() => {
    if (store.index > 0) {
      store.setIndex(store.index - 1);
    } else {
      props.prevUser();
    }
  }, [store, props]);

  const pages = activities.slice(0,2).map((e, i) => (
    <PortraitActivity key={i} entity={e} forceAutoplay />
  ));

  const touchableStyle = {
    top: 90 + insets.top,
    height: height - (230 + insets.bottom),
  };

  return (
    <PagerProvider activeIndex={store.index} onChange={store.setIndex}>
      <View>
        <Pager
          adjacentChildOffset={0}
          maxIndex={activities.length - 1}
          panProps={panProps}
          style={pagerStyle}
          clamp={clamp}
          pageInterpolation={stackConfig}
          initialIndex={store.index}>
          {pages}
        </Pager>
        <PortraitPaginator store={store} pages={pages} />
      </View>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.touchLeft, touchableStyle]}
        onPress={onTapStateChangeLeft}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.touchRight, touchableStyle]}
        onPress={onTapStateChangeRight}
      />
    </PagerProvider>
  );
});

export default UserContentSwiper;

const styles = StyleSheet.create({
  touchLeft: {
    position: 'absolute',
    left: 0,
    width: '50%',
  },
  touchRight: {
    position: 'absolute',
    right: 0,
    width: '50%',
  },
});
