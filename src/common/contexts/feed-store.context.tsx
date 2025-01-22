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
  const WithFeedStore = React.forwardRef<any, T>((props, ref) => (
    <FeedStoreContext.Provider value={props.feedStore}>
      <WrappedComponent {...(props as any)} ref={ref} />
    </FeedStoreContext.Provider>
  ));

  return WithFeedStore as unknown as React.ComponentType<T>;
}

export const useFeedStore = () => useContext(FeedStoreContext);
