import { Platform } from 'react-native';
import {
  MMKVLoader,
  MMKVInstance,
  ProcessingModes,
} from 'react-native-mmkv-storage';

type Storages = {
  session: MMKVInstance;
  app: MMKVInstance;
  user: MMKVInstance | null;
  userPortrait: MMKVInstance | null;
  userCache: MMKVInstance | null;
};

export const storages: Storages = {
  session: createStorage('session', true),
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
): MMKVInstance {
  const loader = new MMKVLoader().withInstanceID(storageId);

  // Multi-process crash on iOS
  if (Platform.OS !== 'ios') {
    loader.setProcessingMode(ProcessingModes.MULTI_PROCESS);
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
  /**
   * If there is a previous user clear memory cache
   */
  storages.user?.clearMemoryCache();
  storages.userCache?.clearMemoryCache();
  storages.userPortrait?.clearMemoryCache();

  storages.user = createStorage(`user_${guid}`);
  storages.userCache = createStorage(`user_cache_${guid}`);
  storages.userPortrait = createStorage(`user_port_${guid}`);
}
