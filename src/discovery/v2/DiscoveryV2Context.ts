import React from 'react';
import DiscoveryV2Store from './DiscoveryV2Store';
import { useLocalStore } from 'mobx-react';

const storesContext = React.createContext(new DiscoveryV2Store());

export const useDiscoveryV2Store = () => {
  return React.useContext(storesContext);
};
