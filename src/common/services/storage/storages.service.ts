import { MMKV } from 'react-native-mmkv';

/**
 * Storage instance
 */
class Storage extends MMKV {
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

  trim() {
    // @ts-ignore this will work once we update to v3 (but it needs new architecture)ƒ
    super.trim?.();
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
      this._session = createStorage('session');
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
