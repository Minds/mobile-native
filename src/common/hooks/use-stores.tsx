import React from 'react';
import { createStores, TStores, TLegacyStores } from '../contexts';
import { useLocalStore, MobXProviderContext } from 'mobx-react';

export const storesContext = React.createContext<TStores | null>(null);

/**
 * This is used in /src/App.tsx and provides a single instance of
 * our global stores
 */
export const StoresProvider = ({ children }) => {
  const stores = useLocalStore(createStores);
  return (
    <storesContext.Provider value={stores}>{children}</storesContext.Provider>
  );
};

/**
 * Allows for a function component to consume our global stores
 * This **MUST** be only consumed below <StoresProvider> (which is placed in src/App.tsx)
 */
export const useStores = (): TStores => {
  const store = React.useContext(storesContext);
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
  return React.useContext(MobXProviderContext) as TLegacyStores;
};
