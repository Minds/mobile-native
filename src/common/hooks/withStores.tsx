import React from 'react';
import { useStores } from './use-stores';

export const withSearchResultStore = (Component: any) => {
  return (props: any) => {
    const searchBar = useStores().searchBar;
    return <Component searchResultStore={searchBar} {...props} />;
  };
};
