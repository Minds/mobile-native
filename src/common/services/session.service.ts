import { observable, action, reaction, computed } from 'mobx';
import {
  RefreshToken,
  SessionStorageService,
  Session,
  AuthType,
  OAuthSession,
  CookieSession,
} from './storage/session.storage.service';
import { getStores } from '../../../AppStores';
import type UserModel from '../../channel/UserModel';

import { ApiService } from './api.service';
import { TokenExpiredError } from './TokenExpiredError';
import { IS_TENANT } from '../../config/Config';
import CookieManager from '@react-native-cookies/cookies';
import { APP_API_URI } from '~/config/Config';
import type { AnalyticsService } from './analytics.service';
import type { Storages } from './storage/storages.service';
import type { LogService } from './log.service';
import type { AuthService } from '~/auth/AuthService';
import type { SettingsService } from '~/settings/SettingsService';
import sp from '~/services/serviceProvider';

const atob = (text: string) => Buffer.from(text, 'base64');

export const MINDS_SESS_COOKIE_NAME = 'minds_sess';

/**
 * Session service
 */
export class SessionService {
  @observable userLoggedIn = false;
  @observable ready = false;

  @observable sessions: Array<Session> = [];
  @observable activeIndex: number = 0;
  @observable sessionExpired: boolean = false;
  @observable switchingAccount: boolean = false;

  @observable sessionToken: string | null = '';

  apiServiceInstances: Array<ApiService> = [];

  deviceToken: string = '';

  /**
   * Session token
   */
  token = '';

  /**
   * Refresh token
   */
  refreshToken = '';

  /**
   * Tokens TTL
   */
  accessTokenExpires: number | null = null;
  refreshTokenExpires: number | null = null;

  /**
   * User guid
   */
  guid: string | null = null;

  /**
   * Initial screen
   */
  initialScreen = '';

  /**
   * Initial screen params
   */
  initialScreenParams: undefined | { [key: string]: any } = undefined;

  @observable refreshingTokens = false;

  recoveryCodeUsed = false;

  /**
   * Constructor
   * @param {object} sessionStorage
   */
  constructor(
    private sessionStorage: SessionStorageService,
    private analytics: AnalyticsService,
    private storages: Storages,
    private log: LogService,
    private settings: SettingsService,
    private auth: AuthService,
  ) {}

  /**
   * returns session count
   */
  get sessionsCount(): number {
    return this.sessions.length;
  }

  /**
   * Get a session for a given index
   * @returns Session
   */
  getSessionForIndex(index: number) {
    return this.sessions[index];
  }

  /**
   * Get sessions array
   */
  getSessions() {
    return this.sessions;
  }

  sessionIndexExists(index: number) {
    return index <= this.sessions.length - 1;
  }

  @computed
  get showAuthNav() {
    return !this.userLoggedIn && !this.switchingAccount;
  }

  /**
   * Init service
   */
  async init() {
    try {
      const sessionData = this.sessionStorage.getAll();

      // if there is no session active we clean up and return;
      if (
        sessionData === null ||
        sessionData === undefined ||
        sessionData.tokensData.length === 0
      ) {
        this.setToken(null);
        this.setRefreshToken(null);
        this.setReady();
        return null;
      }

      this.setActiveIndex(sessionData.activeIndex);
      this.setSessions(sessionData.tokensData);

      const session = this.sessions[this.activeIndex];

      const { user, pseudoId } = session;

      // set the analytics pseudo id (if not tenant)
      this.analytics.setUserId(IS_TENANT ? user.guid : pseudoId);

      let access_token: string;

      if (session.authType === AuthType.Cookie) {
        access_token = session.sessionToken;
        this.setToken(access_token);

        this.sessionToken = session.sessionToken;
      } else {
        const { accessToken, refreshToken } = session;

        access_token = accessToken.access_token;

        const { refresh_token, refresh_token_expires } = refreshToken;

        this.refreshTokenExpires = refresh_token_expires;
        this.accessTokenExpires = accessToken.access_token_expires;

        this.setRefreshToken(refresh_token);
        this.setToken(access_token);
      }

      // ensure user loaded before activate the session
      await this.loadUser(user);

      if (this.guid) {
        this.storages.initStores(this.guid);
        this.settings.loadUserSettings();
      }

      for (let i = 0; i < this.sessions.length; i++) {
        this.apiServiceInstances.push(sp.resolve('apiNoActiveSession', i));
      }

      this.setReady();
      this.setLoggedIn(true);

      return access_token;
    } catch (e) {
      this.setToken(null);
      this.setRefreshToken(null);
      this.log.exception('[SessionService] error getting tokens', e);
      return null;
    }
  }

  tokenCanRefresh(refreshToken?: RefreshToken) {
    if (this.switchingAccount) {
      this.log.info(
        '[sessionService] unable to refresh token when switching account',
      );
      return false;
    }
    if (!refreshToken) {
      return (
        this.refreshToken &&
        this.refreshTokenExpires &&
        this.refreshTokenExpires * 1000 > Date.now()
      );
    }
    const { refresh_token, refresh_token_expires } = refreshToken;
    return (
      refresh_token &&
      refresh_token_expires &&
      refresh_token_expires * 1000 > Date.now()
    );
  }

  async refreshAuthToken() {
    if (this.tokenCanRefresh()) {
      this.log.info('[SessionService] refreshing token...');
      const tokens = await this.auth.refreshToken();
      if ((this.sessions?.length ?? 0) > 0) {
        tokens.pseudo_id = this.sessions[this.activeIndex]?.pseudoId;
        this.sessions[this.activeIndex] = this.buildOAuthSessionData(tokens);
      }
      this.setRefreshToken(tokens.refresh_token);
      this.setToken(tokens.access_token);
      // persist sessions array
      this.persistSessionsArray();
      this.log.info('[SessionService] token refreshed!');
    } else {
      this.log.info("[SessionService] can't refreshing token");
      throw new TokenExpiredError('Session Expired');
    }
  }

  /**
   * Persist the array of sessions
   */
  persistSessionsArray() {
    this.sessionStorage.saveSessions(this.sessions);
  }

  /**
   * Persist the current active session index
   */
  persistActiveIndex() {
    this.sessionStorage.saveActiveIndex(this.activeIndex);
  }

  /**
   * Refresh the auth tokens for the given session index
   */
  async refreshAuthTokenFrom(index: number) {
    const session = this.sessions[index];

    if (session.authType !== AuthType.OAuth) return;

    const { refreshToken, accessToken } = session;
    if (this.tokenCanRefresh(refreshToken)) {
      this.log.info('[SessionService] refreshing token from');
      const tokens = await this.auth.refreshToken(
        refreshToken.refresh_token,
        accessToken.access_token,
      );
      tokens.pseudo_id = this.sessions[index].pseudoId;
      this.sessions[index] = this.buildOAuthSessionData(
        tokens,
        this.sessions[index].user,
      );
      this.persistSessionsArray();
      this.log.info('[SessionService] token refreshed!');
    } else {
      this.log.info("[SessionService] can't refreshing token");
      throw new TokenExpiredError('Session Expired');
    }
  }

  /**
   * Load user information and refresh data async if necessary
   */
  async loadUser(user?: UserModel) {
    if (user) {
      getStores()?.user.setUser(user);
      // we update the user without wait
      getStores()
        ?.user.load(true)
        .then(updatedUser => {
          this.updateActiveSessionUser(updatedUser);
        });
    } else {
      user = await getStores()?.user.load();
    }

    this.guid = user.guid;
  }

  /**
   * Return current user
   */
  getUser(): UserModel {
    return getStores()?.user.me;
  }

  /**
   * Set initial screen
   * @param {string} screen
   * @param {undefined | {[key: string]: any}} params
   */
  setInitialScreen(
    screen: string,
    params?: undefined | { [key: string]: any },
  ) {
    this.initialScreen = screen;
    this.initialScreenParams = params;
  }

  /**
   * Parse jwt
   * @param {string} token
   */
  parseJwt(token) {
    try {
      //@ts-ignore
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.warn('Error parsing token: ', token);
      return null;
    }
  }

  /**
   * Get expiration datetime from token
   * @param {string} token
   */
  getTokenExpiration(token) {
    const parsed = this.parseJwt(token);
    if (parsed && parsed.exp) return parsed.exp;
    return null;
  }

  @action
  setSessions(sessions: Array<Session>) {
    this.sessions = sessions;
  }

  @action
  setLoggedIn(value: boolean) {
    this.userLoggedIn = value;
  }
  @action
  setSwitchingAccount(value: boolean) {
    this.switchingAccount = value;
  }

  @action
  setReady() {
    this.ready = true;
  }

  /**
   * Set token
   */
  setToken(token) {
    this.token = token;
  }

  @action
  setTokenRefreshing(refreshing) {
    this.refreshingTokens = refreshing;
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token) {
    this.refreshToken = token;
  }

  /**
   * Login the current active index
   * @param {string} token
   * @param {boolean} loadUser
   */
  @action
  async login() {
    // create user data storage
    if (this.guid) {
      this.storages.initStores(this.guid);
      this.settings.loadUserSettings();
    }

    this.setLoggedIn(true);
  }

  /**
   * Adds a session using cookie auth
   * This will replace the list of sessions as, at this time,
   * there can only  be one cookie session
   */
  async addCookieSession() {
    const cookies = await CookieManager.get(APP_API_URI, true);
    const sessCookie = cookies[MINDS_SESS_COOKIE_NAME];

    // We use a fake access token
    this.setToken(sessCookie.value);

    this.sessionToken = sessCookie.value;

    // Reload our user now we have a session cookie set
    await this.loadUser();

    const sessionData = this.buildCookieSessionData(
      sessCookie.value,
      this.getUser(),
    );

    const sessions = [sessionData];
    this.setSessions(sessions);

    // set the active index which will be logged
    this.setActiveIndex(this.sessions.length - 1);
    this.apiServiceInstances.push(
      sp.resolve('apiNoActiveSession', this.activeIndex),
    );

    // save all data into session storage
    this.persistSessionsArray();
    this.persistActiveIndex();
  }

  /**
   * Add new tokens info from login to tokens data;
   * @param tokens
   */
  async addOAuthSession(tokens) {
    try {
      await this.setTokens(tokens);

      // get session data from tokens returned by login
      const sessionData = this.buildOAuthSessionData(tokens);

      // set expire
      this.accessTokenExpires = sessionData.accessToken.access_token_expires;
      this.refreshTokenExpires = sessionData.refreshToken.refresh_token_expires;

      // add data to current tokens data array
      const sessions = this.sessions;
      sessions.push(sessionData);
      this.setSessions(sessions);

      this.analytics.setUserId(
        IS_TENANT ? sessionData.user.guid : sessionData.pseudoId,
      );

      // set the active index which will be logged
      this.setActiveIndex(this.sessions.length - 1);
      this.apiServiceInstances.push(
        sp.resolve('apiNoActiveSession', this.activeIndex),
      );

      // save all data into session storage
      this.persistSessionsArray();
      this.persistActiveIndex();
    } catch (err) {
      this.log.exception('[SessionService addSession]', err);
    }
  }

  /**
   * Switch current active user
   */
  async switchUser(sessionIndex: number) {
    const session = this.sessions[sessionIndex];

    if (session.authType !== AuthType.OAuth)
      throw 'Only OAuth supports user switching';

    this.setActiveIndex(sessionIndex);

    await this.setTokens(
      {
        access_token: session.accessToken.access_token,
        refresh_token: session.refreshToken.refresh_token,
      },
      session.user,
    );
    // set expire
    this.accessTokenExpires = session.accessToken.access_token_expires;
    this.refreshTokenExpires = session.refreshToken.refresh_token_expires;

    this.analytics.setUserId(IS_TENANT ? session.user.guid : session.pseudoId);

    // persist index
    this.persistActiveIndex();
  }

  async setTokens(tokens, user?: UserModel) {
    this.setToken(tokens.access_token);
    this.setRefreshToken(tokens.refresh_token);
    await this.loadUser(user);
  }

  /**
   * Build a session object for a cookie based session
   * @param user
   * @returns Session
   */
  buildCookieSessionData(
    sessionToken: string,
    user?: UserModel,
  ): CookieSession {
    return {
      user: user || getStores().user.me,
      pseudoId: '',
      sessionExpired: false,
      authType: AuthType.Cookie,
      sessionToken,
    };
  }

  buildOAuthSessionData(tokens, user?: UserModel): OAuthSession {
    const token_expire = this.getTokenExpiration(tokens.access_token);
    const token_refresh_expire = token_expire + 60 * 60 * 24 * 30;
    return {
      user: user || getStores().user.me,
      pseudoId: tokens.pseudo_id,
      sessionExpired: false,
      authType: AuthType.OAuth,
      accessToken: {
        access_token: tokens.access_token,
        access_token_expires: token_expire,
      },
      refreshToken: {
        refresh_token: tokens.refresh_token,
        refresh_token_expires: token_refresh_expire,
      },
    };
  }

  /**
   * Updated user and persist
   */
  updateActiveSessionUser(user?: UserModel) {
    this.sessions[this.activeIndex].user = user || getStores().user.me;
    this.persistSessionsArray();
  }

  @action
  setActiveIndex(activeIndex: number) {
    this.activeIndex = activeIndex;
  }

  @action
  setSessionExpired(sessionExpired: boolean) {
    this.setSessionExpiredFor(sessionExpired, this.activeIndex);
    this.sessionExpired = sessionExpired;
  }

  @action
  setSessionExpiredFor(sessionExpired: boolean, index: number) {
    this.sessions[index].sessionExpired = sessionExpired;
    this.persistSessionsArray();
  }

  /**
   * Check if it is a re-login attempt
   */
  isRelogin(username: string, data) {
    const index = this.sessions.findIndex(
      value => value.user.username === username,
    );

    if (index !== -1) {
      const sessionData = this.buildOAuthSessionData(
        data,
        this.sessions[index].user,
      );
      this.sessions[index] = sessionData;

      // update the current auth tokens
      this.setToken(data.access_token);
      this.setRefreshToken(data.refresh_token);

      this.setSessionExpired(false);
      // persist data
      this.persistSessionsArray();

      return true;
    }

    return false;
  }

  /**
   * Get the session index for a given guid
   */
  getIndexSessionFromGuid(guid: string) {
    const index = this.sessions.findIndex(
      v => String(guid) === String(v.user.guid),
    );

    return index >= 0 ? index : false;
  }

  /**
   * Logout current user
   */
  logout(clearStorage = true) {
    this.guid = null;
    this.setToken(null);
    this.sessionToken = null;
    this.setRefreshToken(null);
    this.accessTokenExpires = null;
    this.refreshTokenExpires = null;
    this.setLoggedIn(false);
    if (clearStorage) {
      const sessions = this.sessions;
      sessions.splice(this.activeIndex, 1);
      this.setSessions(sessions);
      this.setActiveIndex(0);
      this.popApiServiceInstance();
      this.persistActiveIndex();
      this.persistSessionsArray();
      CookieManager.clearAll();
      CookieManager.clearAll(true); // iOS also needs to clear webkit
    }
  }

  /**
   * Remove last element from array and re-index session indices
   */
  popApiServiceInstance() {
    this.apiServiceInstances.pop();
    for (let i = 0; i < this.sessions.length; i++) {
      this.apiServiceInstances[i].setSessionIndex(i);
    }
  }

  /**
   * Logout user for a given index
   * returns a boolean indicating if it logout the current user
   */
  logoutFrom(index: number): boolean {
    if (index === this.activeIndex) {
      this.logout();
      return true;
    } else {
      const guid = this.sessions[this.activeIndex].user.guid;
      this.sessions.splice(index, 1);
      const newIndex = this.getIndexSessionFromGuid(guid);
      this.setActiveIndex(newIndex || 0);
      this.popApiServiceInstance();
      this.persistActiveIndex();
      this.persistSessionsArray();
      return false;
    }
  }

  /**
   * Run on session change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onSession(fn) {
    return reaction(
      () => [this.userLoggedIn ? this.token : null],
      async args => {
        try {
          await fn(...args);
        } catch (error) {
          this.log.exception('[SessionService]', error);
        }
      },
      { fireImmediately: true },
    );
  }

  /**
   * Run on session change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onLogin(fn) {
    return reaction(
      () => (this.userLoggedIn ? this.token : null),
      async token => {
        if (token) {
          try {
            await fn(token);
          } catch (error) {
            this.log.exception('[SessionService]', error);
          }
        }
      },
      { fireImmediately: true },
    );
  }

  /**
   * Run on session
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onLogout(fn) {
    return reaction(
      () => (this.userLoggedIn ? this.token : null),
      async token => {
        if (!token) {
          try {
            await fn(token);
          } catch (error) {
            this.log.exception('[SessionService]', error);
          }
        }
      },
      { fireImmediately: false },
    );
  }

  setRecoveryCodeUsed(used: boolean) {
    this.recoveryCodeUsed = used;
  }

  getAccessTokenFrom(index) {
    const session = this.sessions[index];
    if (session.authType !== AuthType.OAuth) return '';
    return session.accessToken.access_token;
  }

  getRefreshTokenFrom(index) {
    const session = this.sessions[index];
    if (session.authType !== AuthType.OAuth) return '';
    return session.refreshToken.refresh_token;
  }
}
