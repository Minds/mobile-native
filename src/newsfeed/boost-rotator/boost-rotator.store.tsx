import { useLocalStore } from 'mobx-react';
import React, { useContext, useEffect } from 'react';
import ActivityModel from '../ActivityModel';
import apiService from '../../common/services/api.service';
import { cleanBoosts } from '../../modules/boost/services/boosted-content.service';
import { storages } from '../../common/services/storage/storages.service';

interface BoostRotatorStoreProps {}

interface BoostRotatorStore {
  activeIndex: number;
  fetching: boolean;
  activites: ActivityModel[];
  fetch: () => Promise<void>;
  setActiveIndex: (activeIndex: number) => void;
}

const createBoostRotatorStore = ({}: BoostRotatorStoreProps) => {
  const store: BoostRotatorStore = {
    activeIndex: 0,
    setActiveIndex(activeIndex: number) {
      this.activeIndex = activeIndex;
    },
    fetching: false,
    activites: [],
    async fetch() {
      try {
        this.fetching = true;
        const response = await apiService.get<any>('api/v3/boosts/feed', {
          location: 1,
        });
        if (response?.boosts) {
          const filteredBoosts = cleanBoosts(
            response.boosts.map(b => b.entity),
          );

          this.activites = ActivityModel.createMany(filteredBoosts).map(
            activity => {
              activity.boosted = false;
              return activity;
            },
          );

          // cache boosts
          storages.session?.setArray('BoostRotatorCache', filteredBoosts);
        }
      } finally {
        this.fetching = false;
      }
    },
  };

  const boosts = storages.session?.getArray<ActivityModel>('BoostRotatorCache');
  if (boosts) {
    store.activites = ActivityModel.createMany(boosts);
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

export function useBoostRotatorStore() {
  const store = useContext(BoostRotatorStoreContext)!;

  useEffect(() => {
    store.fetch();
  }, [store]);

  return store;
}

export function withBoostRotatorStore<T>(WrappedComponent: any) {
  return React.forwardRef((props: T, ref: React.Ref<T>) => (
    <BoostRotatorStoreProvider>
      <WrappedComponent {...props} ref={ref} />
    </BoostRotatorStoreProvider>
  )) as any;
}
