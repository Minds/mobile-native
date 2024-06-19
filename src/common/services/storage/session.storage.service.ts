import type UserModel from '../../../channel/UserModel';
import logService from '../log.service';
import { storagesService } from '~/common/services';

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
  sessionToken: string;
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
      const sessionData = storagesService.session.getObject<SessionsData>(KEY);
      const activeIndex = storagesService.session.getNumber(INDEX_KEY) || 0;
      //  the active index was moved outside the session data
      if (sessionData) {
        sessionData.activeIndex = activeIndex;
      }
      return sessionData || null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Save the session array and the current active index
   */
  save(sessionsData: SessionsData) {
    try {
      storagesService.session.setObject(KEY, sessionsData);
      storagesService.session.set(INDEX_KEY, sessionsData.activeIndex);
    } catch (err) {
      logService.exception('[SessionStorage] save', err);
    }
  }

  /**
   * Save the sessions array
   */
  saveSessions(sessions: Sessions) {
    try {
      storagesService.session.setObject(KEY, {
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
    storagesService.session.set(INDEX_KEY, index);
  }

  /**
   * Set access token
   * @param {string} token
   */
  setAccessToken(token, expires) {
    storagesService.session.setObject('access_token', {
      access_token: token,
      access_token_expires: expires,
    });
  }

  /**
   * Set user
   * @param {object} user
   */
  setUser(user) {
    storagesService.session.setObject('user', user);
  }

  /**
   * Set access token
   * @param {string} token
   * @param {string} guid
   */
  setRefreshToken(token, expires) {
    storagesService.session.setObject('refresh_token', {
      refresh_token: token,
      refresh_token_expires: expires,
    });
  }

  /**
   * Clear all session data (logout)
   */
  clear() {
    storagesService.session.clearAll();
  }
}
