import React, { createContext, useContext } from 'react';
import FeedStore from '../stores/FeedStore';
import BaseModel from '../BaseModel';

export const FeedStoreContext = createContext<FeedStore<BaseModel> | null>(
  null,
);

export function withFeedStoreProvider<
  T extends {
    feedStore: FeedStore<BaseModel>;
  },
>(WrappedComponent: React.ComponentType<T>) {
  return React.forwardRef((props: T, ref: React.Ref<T>) => (
    <FeedStoreContext.Provider value={props.feedStore}>
      <WrappedComponent {...props} ref={ref} />
    </FeedStoreContext.Provider>
  )) as any;
}

export const useFeedStore = () => useContext(FeedStoreContext);
