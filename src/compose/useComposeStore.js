import { useLocalStore } from 'mobx-react';
import createComposerStore from './createComposeStore';

/**
 * Local compose store hook
 */
export default function (props) {
  const store = useLocalStore(createComposerStore, props);
  return store;
}

export type ComposeStoreType = ReturnType<typeof createComposerStore>;
