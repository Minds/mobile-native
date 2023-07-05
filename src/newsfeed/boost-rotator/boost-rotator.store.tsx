import { useLocalStore } from 'mobx-react';
import { boostedContentService, cleanBoosts } from 'modules/boost';
import React, { useContext, useEffect } from 'react';
import apiService from '~/common/services/api.service';
import MetadataService from '~/common/services/metadata.service';
import { storages } from '~/common/services/storage/storages.service';
import ActivityModel from '../ActivityModel';
import { recordView } from '../NewsfeedService';
import { BOOSTS_DELAY } from '~/config/Config';

const CACHE_KEY = 'BoostRotatorCache';

interface BoostRotatorStoreProps {}

interface BoostRotatorStore {
  activeIndex: number;
  fetching: boolean;
  activites: ActivityModel[];
  fetch: () => Promise<void>;
  trackView: () => void;
  setActiveIndex: (activeIndex: number) => void;
}

export const boostRotatorMetadata = new MetadataService()
  .setMedium('feed')
  .setSource('boost-rotator');

const createBoostRotatorStore = ({}: BoostRotatorStoreProps) => {
  const store: BoostRotatorStore = {
    activeIndex: 0,
    setActiveIndex(activeIndex: number) {
      this.activeIndex = activeIndex;
      this.trackView();
    },
    trackView() {
      const activity = this.activites[this.activeIndex];

      if (activity) {
        recordView(activity, boostRotatorMetadata.getClientMetadata(activity));
      }
    },
    fetching: false,
    activites: [],
    async fetch() {
      try {
        this.fetching = true;
        const response = await apiService.get<any>('api/v3/boosts/feed', {
          location: 1,
          show_boosts_after_x: BOOSTS_DELAY,
        });
        if (response?.boosts) {
          const filteredBoosts = cleanBoosts(
            response.boosts.map(b => b.entity),
          );

          this.activites = ActivityModel.createMany(filteredBoosts).map(
            (activity, index) => {
              activity.boosted = false;
              activity.position = index + 1;
              return activity;
            },
          );

          // cache boosts
          storages.session?.setArray(CACHE_KEY, filteredBoosts);
        }
      } finally {
        this.fetching = false;
      }
    },
  };

  // load from cache
  const boosts = storages.session?.getArray<ActivityModel>(CACHE_KEY);
  if (boosts) {
    store.activites = ActivityModel.createMany(boosts);
  } else {
    // show a single boost if no cache existed
    const boost = boostedContentService.fetch();
    if (boost) {
      store.activites = [boost];
    }
  }

  return store;
};

const BoostRotatorStoreContext = React.createContext<BoostRotatorStore | null>(
  null,
);

function BoostRotatorStoreProvider(
  props: React.PropsWithChildren<BoostRotatorStoreProps>,
) {
  const boostRotatorStore = useLocalStore(createBoostRotatorStore, {});
  return (
    <BoostRotatorStoreContext.Provider {...props} value={boostRotatorStore} />
  );
}

export function useBoostRotatorStore(fetch?: boolean) {
  const store = useContext(BoostRotatorStoreContext)!;

  useEffect(() => {
    if (fetch) {
      store.fetch();
    }
  }, [store, fetch]);

  return store;
}

export function withBoostRotatorStore<T>(WrappedComponent: any) {
  return React.forwardRef((props: T, ref: React.Ref<T>) => (
    <BoostRotatorStoreProvider>
      <WrappedComponent {...props} ref={ref} />
    </BoostRotatorStoreProvider>
  )) as any;
}
