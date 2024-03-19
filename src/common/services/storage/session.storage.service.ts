import type UserModel from '../../../channel/UserModel';
import logService from '../log.service';
import { storages } from './storages.service';

const KEY = 'SESSIONS_DATA';
const INDEX_KEY = 'SESSIONS_ACTIVE_INDEX';

export type RefreshToken = {
  refresh_token: string;
  refresh_token_expires: number | null;
};

export enum AuthType {
  OAuth,
  Cookie,
}

export type BaseSession = {
  user: UserModel;
  pseudoId: string; // used for snowplow
  sessionExpired: boolean;
};

export type CookieSession = BaseSession & {
  authType: AuthType.Cookie;
};

export type OAuthSession = BaseSession & {
  authType: AuthType.OAuth;
  refreshToken: {
    refresh_token: string;
    refresh_token_expires: number | null;
  };
  accessToken: {
    access_token: string;
    access_token_expires: number | null;
  };
};

export type Session = CookieSession | OAuthSession;

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

      if (sessionData === null || sessionData === undefined) {
        return this.checkAndMigrate();
      }
      //  the active index was moved outside the session data
      if (sessionData) {
        sessionData.activeIndex = activeIndex;
      }
      return sessionData;
    } catch (err) {
      return null;
    }
  }

  checkAndMigrate() {
    const data = storages.session.getMultipleItems<any>(
      ['access_token', 'refresh_token', 'user'],
      'object',
    );

    if (!data) {
      return null;
    }

    const accessToken = data[0][1],
      refreshToken = data[1][1],
      user = data[2][1];

    if (!accessToken || !refreshToken || !user) {
      return null;
    }

    const sessionsData: SessionsData = {
      activeIndex: 0,
      tokensData: [
        {
          user,
          pseudoId: '',
          refreshToken,
          accessToken,
          sessionExpired: false,
          authType: AuthType.OAuth,
        },
      ],
    };

    this.save(sessionsData);

    // we remove the legacy session data once migrated
    storages.session.removeItem('access_token');
    storages.session.removeItem('refresh_token');
    storages.session.removeItem('user');

    return sessionsData;
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
   * Set access token
   * @param {string} token
   */
  setAccessToken(token, expires) {
    storages.session.setMap('access_token', {
      access_token: token,
      access_token_expires: expires,
    });
  }

  /**
   * Set user
   * @param {object} user
   */
  setUser(user) {
    storages.session.setMap('user', user);
  }

  /**
   * Set access token
   * @param {string} token
   * @param {string} guid
   */
  setRefreshToken(token, expires) {
    storages.session.setMap('refresh_token', {
      refresh_token: token,
      refresh_token_expires: expires,
    });
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
