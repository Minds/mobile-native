import { getStores } from '../../../AppStores';

export const useDiscoveryV2Store = () => {
  return getStores().discoveryV2Store;
};

export const useMindsPlusV2Store = () => {
  return getStores().mindsPlusV2Store;
};
