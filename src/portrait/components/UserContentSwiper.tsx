import { useFocusEffect } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import ViewStore from '~/common/stores/ViewStore';

import { useCarouselFocusEffect } from '../PortraitViewerScreen';
import PortraitBarItem from '../models/PortraitBarItem';
import PortraitActivity from './PortraitActivity';
import PortraitPaginator from './PortraitPaginator';
import { useMetadataService } from '~/services/hooks/useMetadataService';
import sp from '~/services/serviceProvider';

type PropsType = {
  item: PortraitBarItem;
  nextUser: Function;
  prevUser: Function;
  unseenMode: boolean;
};

/**
 * User content swiper
 */
const UserContentSwiper = observer((props: PropsType) => {
  const activities = props.item.activities;
  const firstUnseen = activities.findIndex(a => !a.seen);
  const deltaPosition = React.useRef(0);
  const metadataService = useMetadataService('portrait', 'feed');
  const portraitContentService = sp.resolve('portraitContent');
  const store = useLocalStore(() => ({
    index: firstUnseen !== -1 ? firstUnseen : 0,
    viewStore: new ViewStore(),
    playing: true,
    autoResumeOnFocus: true,
    setIndex(v) {
      if (v < 0 || v >= activities.length) {
        return;
      }
      store.index = v;
      portraitContentService.seen(activities[store.index].urn);
      activities[store.index].seen = true;
      store.viewStore.view(
        activities[store.index],
        metadataService,
        'portrait',
        Math.abs(
          deltaPosition.current - (activities[store.index].position || 0),
        ) + 1,
      );
    },
    next: () => {
      store.videoProgress = undefined;

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
    },
    prev: () => {
      store.videoProgress = undefined;

      if (store.index > 0) {
        store.setIndex(store.index - 1);
      } else {
        props.prevUser();
      }
    },
    pause: (autoResumeOnFocus = false) => {
      if (!store.playing) {
        return;
      }

      store.playing = false;
      store.autoResumeOnFocus = autoResumeOnFocus;
    },
    resume: (autoResume = false) => {
      if (!store.autoResumeOnFocus && autoResume) {
        return;
      }

      store.playing = true;
      store.autoResumeOnFocus = true;
    },
    videoProgress: undefined as number | undefined,
    setVideoProgress(progress: number) {
      this.videoProgress = progress;
    },
  }));

  useFocusEffect(
    useCallback(() => {
      deltaPosition.current = activities[store.index].position || 0;
    }, [activities, store]),
  );

  useCarouselFocusEffect(() => {
    store.viewStore.view(
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

  useFocusEffect(
    useCallback(() => {
      store.resume(true);

      return () => {
        store.pause(true);
      };
    }, [store]),
  );

  return (
    <View style={sp.styles.style.flexContainer}>
      <PortraitActivity
        hasPaginator
        key={`activity${store.index}`}
        entity={activities[store.index]}
        forceAutoplay
        onPressNext={store.next}
        onPressPrev={store.prev}
        onLongPress={store.pause}
        onPressOut={store.resume}
        onVideoProgress={store.setVideoProgress}
      />
      <PortraitPaginator store={store} activities={activities} />
    </View>
  );
});

export default UserContentSwiper;
