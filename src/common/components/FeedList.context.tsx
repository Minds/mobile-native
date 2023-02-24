import React, { createContext, useContext } from 'react';
import FeedStore from '../stores/FeedStore';
import BaseModel from '../BaseModel';

export const FeedListContext = createContext<FeedStore<BaseModel> | null>(null);

export function withFeedListProvider<
  T extends {
    feedStore: FeedStore<BaseModel>;
  }
>(WrappedComponent: React.ComponentType<T>) {
  return React.forwardRef((props: T, ref: React.Ref<T>) => (
    <FeedListContext.Provider value={props.feedStore}>
      <WrappedComponent {...props} ref={ref} />
    </FeedListContext.Provider>
  )) as any;
}

export const useFeedListContext = () => useContext(FeedListContext);
