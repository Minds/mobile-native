import React from 'react';
import { TLegacyStores } from '../contexts';
import { useLocalStore, MobXProviderContext } from 'mobx-react';
import createWalletStore, {
  WalletStoreType,
} from '~/wallet/v2/createWalletStore';
import createSearchResultStore, {
  SearchResultStoreType,
} from '~/topbar/searchbar/createSearchResultStore';
import createPortraitStore, {
  PortraitStoreType,
} from '~/portrait/portrait.store';
import createChatStore, { ChatStoreType } from '~/chat/createChatStore';
import createNotificationsStore, {
  NotificationsStore,
} from '~/notifications/v3/createNotificationsStore';
import sp from '~/services/serviceProvider';

export const storesContext = React.createContext<StoresType | null>(null);

/**
 * This is used in /src/App.tsx and provides a single instance of
 * our global stores
 */
export const StoresProvider = ({ children }) => {
  const stores = {
    wallet: useLocalStore(createWalletStore),
    searchBar: useLocalStore(createSearchResultStore),
    portrait: useLocalStore(createPortraitStore),
    chat: useLocalStore(createChatStore),
    notifications: useLocalStore(createNotificationsStore),
  };

  React.useEffect(() => {
    return sp.session.onLogout(() => {
      for (const id in stores) {
        if (stores[id].reset) {
          sp.log.info(`Reseting store ${id}`);
          stores[id].reset();
        }
      }
    });
  }, []);

  return (
    <storesContext.Provider value={stores}>{children}</storesContext.Provider>
  );
};

export type StoresType = {
  wallet: WalletStoreType;
  searchBar: SearchResultStoreType;
  portrait: PortraitStoreType;
  chat: ChatStoreType;
  notifications: NotificationsStore;
};

/**
 * Allows for a function component to consume our global stores
 * This **MUST** be only consumed below <StoresProvider> (which is placed in src/App.tsx)
 */
export const useStores = (): StoresType => {
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
