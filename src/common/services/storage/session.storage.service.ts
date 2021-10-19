import type UserModel from '../../../channel/UserModel';
import logService from '../log.service';
import { storages } from './storages.service';

const KEY = 'SESSIONS_DATA';

export type RefreshToken = {
  refresh_token: string;
  refresh_token_expires: number | null;
};

export type TokensData = {
  user: UserModel;
  sessionExpired: boolean;
  refreshToken: {
    refresh_token: string;
    refresh_token_expires: number | null;
  };
  accessToken: {
    access_token: string;
    access_token_expires: number | null;
  };
};

export type SessionsData = {
  activeIndex: number;
  tokensData: Array<TokensData>;
};

/**
 * Session service
 */
export class SessionStorageService {
  /**
   * Get tokens of the current user
   */
  getAll() {
    try {
      const sessionData = storages.session.getMap<SessionsData>(KEY);
      if (sessionData === null || sessionData === undefined) {
        return this.checkAndMigrate();
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
          refreshToken,
          accessToken,
          sessionExpired: false,
        },
      ],
    };

    this.save(sessionsData);
    return sessionsData;
  }

  save(sessionsData: SessionsData) {
    try {
      storages.session.setMap(KEY, sessionsData);
    } catch (err) {
      logService.exception('[SessionStorage] save', err);
    }
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
   * Get messenger private key of the current user
   */
  getPrivateKey(): Promise<string | null | undefined> {
    return storages.session.getStringAsync('private_key');
  }

  /**
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
