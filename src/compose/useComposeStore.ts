import { useLocalStore } from 'mobx-react';
import createComposerStore from './createComposeStore';
import React, { useContext } from 'react';

/**
 * Local compose store hook
 */
export default function (props) {
  const store = useLocalStore(createComposerStore, props);
  return store;
}

export type ComposeStoreType = ReturnType<typeof createComposerStore>;
export const ComposeContext = React.createContext<ComposeStoreType | null>(
  null,
);
export const useComposeContext = () => {
  return useContext(ComposeContext)!;
};
