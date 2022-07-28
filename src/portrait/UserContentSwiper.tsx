import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalStore, observer } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
import portraitContentService from './PortraitContentService';
import Viewed from '../common/stores/Viewed';
import MetadataService from '../common/services/metadata.service';
import PortraitPaginator from './PortraitPaginator';
import { PortraitBarItem } from './createPortraitStore';
import PortraitActivity from './PortraitActivity';
import { useCarouselFocusEffect } from './PortraitViewerScreen';

type PropsType = {
  item: PortraitBarItem;
  nextUser: Function;
  prevUser: Function;
  unseenMode: boolean;
};

const metadataService = new MetadataService();
metadataService.setSource('portrait').setMedium('feed');

/**
 * User content swiper
 */
const UserContentSwiper = observer((props: PropsType) => {
  const activities = props.item.activities;
  const firstUnseen = activities.findIndex(a => !a.seen);
  const deltaPosition = React.useRef(0);

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
      store.viewed.addViewed(
        activities[store.index],
        metadataService,
        'portrait',
        Math.abs(
          deltaPosition.current - (activities[store.index].position || 0),
        ) + 1,
      );
    },
  }));

  useFocusEffect(
    useCallback(() => {
      deltaPosition.current = activities[store.index].position || 0;
    }, [activities, store]),
  );

  useCarouselFocusEffect(() => {
    store.viewed.addViewed(
      activities[store.index],
      metadataService,
      'portrait',
      Math.abs(
        deltaPosition.current - (activities[store.index].position || 0),
      ) + 1,
    );
    portraitContentService.seen(activities[store.index].urn);
    activities[store.index].seen = true;
  });

  const onTapStateChangeRight = useCallback(() => {
    if (store.index < activities.length - 1) {
      if (
        props.unseenMode &&
        !activities.slice(store.index).some(p => p.seen) // there no seen posts ahead
      ) {
        if (activities[store.index + 1].seen) {
          props.nextUser();
          return;
        }
      }
      store.setIndex(store.index + 1);
    } else {
      props.nextUser();
    }
  }, [activities, store, props]);

  const onTapStateChangeLeft = useCallback(() => {
    if (store.index > 0) {
      store.setIndex(store.index - 1);
    } else {
      props.prevUser();
    }
  }, [store, props]);

  return (
    <View style={ThemedStyles.style.flexContainer}>
      <PortraitActivity
        hasPaginator={activities.length > 1}
        key={`activity${store.index}`}
        entity={activities[store.index]}
        forceAutoplay
        onPressNext={onTapStateChangeRight}
        onPressPrev={onTapStateChangeLeft}
      />
      <PortraitPaginator store={store} activities={activities} />
    </View>
  );
});

export default UserContentSwiper;
