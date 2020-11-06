import { useLocalStore } from 'mobx-react';
import createPortraitStore from '../../../portrait/createPortraitStore';
import createSearchResultStore from '../../../topbar/searchbar/createSearchResultStore';
import createWalletStore from '../../../wallet/v2/createWalletStore';
import { createLegacyStores, TLegacyStores } from '../../contexts';
import { StoresType } from '../use-stores';

/**
 * Allows for a function component to consume our global stores
 * This **MUST** be only consumed below <StoresProvider> (which is placed in src/App.tsx)
 */
export const useStores = (): StoresType => {
  const stores = {
    wallet: useLocalStore(createWalletStore),
    searchBar: useLocalStore(createSearchResultStore),
    portrait: useLocalStore(createPortraitStore),
  };
  return stores;
};

/**
 * Allows for a function component to consume our legacy global stores that have been
 * provided via mobx's <Provider>
 */
export const useLegacyStores = (): TLegacyStores => {
  return createLegacyStores();
};
