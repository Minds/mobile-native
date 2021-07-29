import { Platform } from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';

type Storages = {
  session: MMKVStorage.API;
  app: MMKVStorage.API;
  user: MMKVStorage.API | null;
};

export const storages: Storages = {
  session: createStorage('session'),
  app: createStorage('app'),
  user: null,
};

/**
 * Create a MMKV storage
 */
export function createStorage(
  storageId: string,
  encrypted = false,
): MMKVStorage.API {
  const loader = new MMKVStorage.Loader().withInstanceID(storageId);

  // Multiprocess crash on iOS
  if (Platform.OS !== 'ios') {
    loader.setProcessingMode(MMKVStorage.MODES.MULTI_PROCESS);
  }
  if (encrypted) {
    loader.withEncryption();
  }

  return loader.initialize();
}

/**
 * Creates the current user store
 * To be called only by the session service
 */
export function createUserStore(guid: string) {
  storages.user = createStorage(`user_${guid}`);
}
