import React from 'react';
import DiscoveryV2SearchStore from './DiscoveryV2SearchStore';

export const DiscoveryV2SearchStoreContext = React.createContext<
  DiscoveryV2SearchStore | undefined
>(undefined);

export const useDiscoveryV2SearchStore = () => {
  const context = React.useContext(DiscoveryV2SearchStoreContext);

  if (!context) {
    throw new Error('DiscoveryV2SearchStoreContext unavailable');
  }

  return context;
};
