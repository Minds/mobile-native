import { observable, action, reaction, computed } from 'mobx';
import {
  RefreshToken,
  SessionStorageService,
  Session,
} from './storage/session.storage.service';
import AuthService from '../../auth/AuthService';
import { getStores } from '../../../AppStores';
import logService from './log.service';
import type UserModel from '../../channel/UserModel';
import { createUserStore } from './storage/storages.service';
import SettingsStore from '../../settings/SettingsStore';
import { ApiService } from './api.service';
import analyticsService from './analytics.service';

export class TokenExpiredError extends Error {}

export const isTokenExpired = error => {
  return error instanceof TokenExpiredError;
};

const atob = (text: string) => Buffer.from(text, 'base64');

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
   * Session storage service
   */
  sessionStorage: SessionStorageService;

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
  constructor(sessionStorage: SessionStorageService) {
    this.sessionStorage = sessionStorage;
  }

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

      const { accessToken, refreshToken, user, pseudoId } =
        this.sessions[this.activeIndex];

      // set the analytics pseudo id
      analyticsService.setUserId(pseudoId);

      const { access_token, access_token_expires } = accessToken;
      const { refresh_token, refresh_token_expires } = refreshToken;

      this.refreshTokenExpires = refresh_token_expires;
      this.accessTokenExpires = access_token_expires;

      this.setRefreshToken(refresh_token);
      this.setToken(access_token);

      // ensure user loaded before activate the session
      await this.loadUser(user);

      if (this.guid) {
        createUserStore(this.guid);
        SettingsStore.loadUserSettings();
      }

      for (let i = 0; i < this.sessions.length; i++) {
        this.apiServiceInstances.push(new ApiService(i));
      }

      this.setReady();
      this.setLoggedIn(true);

      return access_token;
    } catch (e) {
      this.setToken(null);
      this.setRefreshToken(null);
      logService.exception('[SessionService] error getting tokens', e);
      return null;
    }
  }

  tokenCanRefresh(refreshToken?: RefreshToken) {
    if (this.switchingAccount) {
      logService.info(
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
      logService.info('[SessionService] refreshing token...');
      const tokens = await AuthService.refreshToken();
      tokens.pseudo_id = this.sessions[this.activeIndex].pseudoId;
      this.setRefreshToken(tokens.refresh_token);
      this.setToken(tokens.access_token);
      this.sessions[this.activeIndex] = this.buildSessionData(tokens);
      // persist sessions array
      this.persistSessionsArray();
      logService.info('[SessionService] token refreshed!');
    } else {
      logService.info("[SessionService] can't refreshing token");
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
    const { refreshToken, accessToken } = this.sessions[index];
    if (this.tokenCanRefresh(refreshToken)) {
      logService.info('[SessionService] refreshing token from');
      const tokens = await AuthService.refreshToken(
        refreshToken.refresh_token,
        accessToken.access_token,
      );
      tokens.pseudo_id = this.sessions[index].pseudoId;
      this.sessions[index] = this.buildSessionData(
        tokens,
        this.sessions[index].user,
      );
      this.persistSessionsArray();
      logService.info('[SessionService] token refreshed!');
    } else {
      logService.info("[SessionService] can't refreshing token");
      throw new TokenExpiredError('Session Expired');
    }
  }

  /**
   * Load user information and refresh data async if necessary
   */
  async loadUser(user?: UserModel) {
    if (user) {
      getStores().user.setUser(user);
      // we update the user without wait
      getStores()
        .user.load(true)
        .then(updatedUser => {
          this.updateActiveSessionUser(updatedUser);
        });
    } else {
      user = await getStores().user.load();
    }

    this.guid = user.guid;
  }

  /**
   * Return current user
   */
  getUser(): UserModel {
    return getStores().user.me;
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
      createUserStore(this.guid);
      SettingsStore.loadUserSettings();
    }

    this.setLoggedIn(true);
  }

  /**
   * Add new tokens info from login to tokens data;
   * @param tokens
   */
  async addSession(tokens) {
    try {
      await this.setTokens(tokens);

      // get session data from tokens returned by login
      const sessionData = this.buildSessionData(tokens);

      // set expire
      this.accessTokenExpires = sessionData.accessToken.access_token_expires;
      this.refreshTokenExpires = sessionData.refreshToken.refresh_token_expires;

      // add data to current tokens data array
      const sessions = this.sessions;
      sessions.push(sessionData);
      this.setSessions(sessions);

      analyticsService.setUserId(sessionData.pseudoId);

      // set the active index which will be logged
      this.setActiveIndex(this.sessions.length - 1);
      this.apiServiceInstances.push(new ApiService(this.activeIndex));

      // save all data into session storage
      this.persistSessionsArray();
      this.persistActiveIndex();
    } catch (err) {
      logService.exception('[SessionService addSession]', err);
    }
  }

  /**
   * Switch current active user
   */
  async switchUser(sessionIndex: number) {
    this.setActiveIndex(sessionIndex);
    const sessions = this.sessions[sessionIndex];
    await this.setTokens(
      {
        access_token: sessions.accessToken.access_token,
        refresh_token: sessions.refreshToken.refresh_token,
      },
      sessions.user,
    );
    // set expire
    this.accessTokenExpires = sessions.accessToken.access_token_expires;
    this.refreshTokenExpires = sessions.refreshToken.refresh_token_expires;

    analyticsService.setUserId(sessions.pseudoId);

    // persist index
    this.persistActiveIndex();
  }

  async setTokens(tokens, user?: UserModel) {
    this.setToken(tokens.access_token);
    this.setRefreshToken(tokens.refresh_token);
    await this.loadUser(user);
  }

  /**
   * Get the token for a given index on sessions
   * @param index
   * @returns the access token
   */
  getTokenWithIndex(index: number) {
    return this.sessions[index].accessToken.access_token;
  }

  buildSessionData(tokens, user?: UserModel) {
    const token_expire = this.getTokenExpiration(tokens.access_token);
    const token_refresh_expire = token_expire + 60 * 60 * 24 * 30;
    return {
      user: user || getStores().user.me,
      pseudoId: tokens.pseudo_id,
      sessionExpired: false,
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
      const sessionData = this.buildSessionData(
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
          logService.exception('[SessionService]', error);
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
            logService.exception('[SessionService]', error);
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
            logService.exception('[SessionService]', error);
          }
        }
      },
      { fireImmediately: false },
    );
  }

  /**
   * Clear messenger keys
   */
  clearMessengerKeys() {
    return this.sessionStorage.clearPrivateKey();
  }

  setRecoveryCodeUsed(used: boolean) {
    this.recoveryCodeUsed = used;
  }

  getAccessTokenFrom(index) {
    return this.sessions[index].accessToken.access_token;
  }

  getRefreshTokenFrom(index) {
    return this.sessions[index].refreshToken.refresh_token;
  }
}

export default new SessionService(new SessionStorageService());
