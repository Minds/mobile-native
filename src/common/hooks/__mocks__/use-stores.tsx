import { useLocalStore } from 'mobx-react';
import {
  createStores,
  TStores,
  createLegacyStores,
  TLegacyStores,
} from '../../contexts';

/**
 * Allows for a function component to consume our global stores
 * This **MUST** be only consumed below <StoresProvider> (which is placed in src/App.tsx)
 */
export const useStores = (): TStores => {
  const store = useLocalStore(createStores);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStores must be used within a StoreProvider.');
  }
  return store;
};

/**
 * Allows for a function component to consume our legacy global stores that have been
 * provided via mobx's <Provider>
 */
export const useLegacyStores = (): TLegacyStores => {
  return createLegacyStores();
};
