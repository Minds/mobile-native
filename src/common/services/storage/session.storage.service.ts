import { Cookies } from '@react-native-cookies/cookies';
import type UserModel from '../../../channel/UserModel';
import logService from '../log.service';
import { storages } from './storages.service';

const KEY = 'SESSIONS_DATA';
const INDEX_KEY = 'SESSIONS_ACTIVE_INDEX';

export type Session = {
  user: UserModel;
  cookies?: Cookies;
  sessionExpired: boolean;
};

export type Sessions = Array<Session>;

export type SessionsData = {
  activeIndex: number;
  tokensData: Array<Session>;
};

/**
 * Session service
 */
export class SessionStorageService {
  /**
   * Get tokens of the current user
   */
  getAll(): SessionsData | null {
    try {
      const sessionData = storages.session.getMap<SessionsData>(KEY);
      const activeIndex = storages.session.getInt(INDEX_KEY) || 0;

      if (sessionData) {
        sessionData.activeIndex = activeIndex;
        return sessionData;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Save the session array and the current active index
   */
  save(sessionsData: SessionsData) {
    try {
      storages.session.setMap(KEY, sessionsData);
      storages.session.setInt(INDEX_KEY, sessionsData.activeIndex);
    } catch (err) {
      logService.exception('[SessionStorage] save', err);
    }
  }

  /**
   * Save the sessions array
   */
  saveSessions(sessions: Sessions) {
    try {
      storages.session.setMap(KEY, {
        tokensData: sessions,
      });
    } catch (err) {
      logService.exception('[SessionStorage] save', err);
    }
  }

  /**
   * Save the active
   */
  saveActiveIndex(index: number) {
    storages.session.setInt(INDEX_KEY, index);
  }

  /**
   * Save cookies
   * @param {Cookies} cookies
   */
  setCookies(cookies) {
    storages.session.setMap('cookies', cookies);
  }

  /**
   * Set user
   * @param {object} user
   */
  setUser(user) {
    storages.session.setMap('user', user);
  }

  /**
   * Deprecated
   * Get messenger private key of the current user
   */
  getPrivateKey(): Promise<string | null | undefined> {
    return storages.session.getStringAsync('private_key');
  }

  /**
   * Deprecated
   * Set private key
   * @param {string} privateKey
   */
  setPrivateKey(privateKey: string) {
    storages.session.setString('private_key', privateKey);
  }

  /**
   * Clear messenger private keys
   */
  clearPrivateKey() {
    storages.session.removeItem('private_key');
  }

  /**
   * Clear all session data (logout)
   */
  async clear() {
    await storages.session.clearStore();
  }
}
