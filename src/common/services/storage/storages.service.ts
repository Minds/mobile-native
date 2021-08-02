import { Platform } from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';

type Storages = {
  session: MMKVStorage.API;
  app: MMKVStorage.API;
  user: MMKVStorage.API | null;
  userPortrait: MMKVStorage.API | null;
  userCache: MMKVStorage.API | null;
};

export const storages: Storages = {
  session: createStorage('session'),
  app: createStorage('app'),
  user: null,
  userPortrait: null,
  userCache: null,
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
 * Creates the current user stores
 * To be called only by the session service
 */
export function createUserStore(guid: string) {
  storages.user = createStorage(`user_${guid}`);
  storages.userCache = createStorage(`user_cache_${guid}`);
  storages.userPortrait = createStorage(`user_port_${guid}`);
}
