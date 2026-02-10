import { createMMKV } from 'react-native-mmkv';
import type { MMKV } from 'react-native-mmkv';

/**
 * Storage instance
 */
export class Storage {
  private mmkv: MMKV;

  constructor(config: { id: string }) {
    this.mmkv = createMMKV(config);
  }

  getString(key: string) {
    return this.mmkv.getString(key);
  }

  set(key: string, value: boolean | string | number | ArrayBuffer) {
    this.mmkv.set(key, value);
  }

  getNumber(key: string) {
    return this.mmkv.getNumber(key);
  }

  getBoolean(key: string) {
    return this.mmkv.getBoolean(key);
  }

  contains(key: string) {
    return this.mmkv.contains(key);
  }

  delete(key: string) {
    this.mmkv.remove(key);
  }

  getAllKeys() {
    return this.mmkv.getAllKeys();
  }

  clearAll() {
    this.mmkv.clearAll();
  }

  trim() {
    this.mmkv.trim();
  }

  getObject<T>(key: string): T | undefined {
    const data = this.getString(key);
    if (data) {
      return JSON.parse(data);
    }
    return undefined;
  }

  setObject<T>(key: string, value: T) {
    this.set(key, JSON.stringify(value));
  }
}

export class Storages {
  private _guid = '';
  private _session?: Storage;
  private _app?: Storage;
  private _userPortrait?: Storage;
  private _userCache?: Storage;
  private _user?: Storage;

  get session() {
    if (!this._session) {
      this._session = createStorage('sessionStorage');
    }
    return this._session;
  }
  get app() {
    if (!this._app) {
      this._app = createStorage('app');
    }
    return this._app;
  }
  get userPortrait() {
    if (!this._userPortrait && this._guid) {
      this._userPortrait = createStorage(`user_port_${this._guid}`);
    }
    return this._userPortrait;
  }
  get userCache() {
    if (!this._userCache && this._guid) {
      this._userCache = createStorage(`user_cache_${this._guid}`);
    }
    return this._userCache;
  }
  get user() {
    if (!this._user && this._guid) {
      this._user = createStorage(`user_${this._guid}`);
    }
    return this._user;
  }
  /**
   * Initialize user stores
   * @param guid current user GUID
   */
  initStores(guid: string) {
    this._guid = guid;

    this._user?.trim();
    this._userCache?.trim();
    this._userPortrait?.trim();

    this._user = undefined;
    this._userCache = undefined;
    this._userPortrait = undefined;
  }
}

/**
 * Create a MMKV storage
 */
function createStorage(id: string): Storage {
  return new Storage({
    id,
  });
}
