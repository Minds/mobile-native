import React from 'react';
import BoostConsoleStore from '../boost-console.store';

export const BoostConsoleStoreContext =
  React.createContext<BoostConsoleStore | null>(null);

export function useBoostConsoleStore() {
  return React.useContext(BoostConsoleStoreContext)!;
}
