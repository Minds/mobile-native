import { MMKVLoader, MMKVInstance } from 'react-native-mmkv-storage';

type Storages = {
  session: MMKVInstance;
  app: MMKVInstance;
  user: MMKVInstance | null;
  userPortrait: MMKVInstance | null;
  userCache: MMKVInstance | null;
};

export const storages: Storages = {
  session: createStorage('sessionStorage'),
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

  if (encrypted) {
    loader.withEncryption();
  }
  const instance = loader.initialize();

  if (storageId === 'sessionStorage') {
    migrateSessionStorage(instance);
  }

  return instance;
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

function migrateSessionStorage(instance: MMKVInstance) {
  const KEY = 'SESSIONS_DATA';
  const INDEX_KEY = 'SESSIONS_ACTIVE_INDEX';

  const currentIndex = instance.getInt(INDEX_KEY);

  if (currentIndex !== undefined && currentIndex !== null) {
    return;
  }

  console.log('Migrating session storage');

  // legacy session storage
  const loader = new MMKVLoader().withInstanceID('session').withEncryption();
  const legacy = loader.initialize();

  const sessions = legacy.getMap(KEY);
  const index = legacy.getInt(INDEX_KEY);

  if (sessions && index !== undefined) {
    instance.setMap(KEY, sessions);
    instance.setInt(INDEX_KEY, index);
  }
}
