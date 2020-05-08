import React from 'react';
import DiscoveryV2SearchStore from './DiscoveryV2SearchStore';

const storesContext = React.createContext(new DiscoveryV2SearchStore());

export const useDiscoveryV2SearchStore = () => {
  return React.useContext(storesContext);
};
