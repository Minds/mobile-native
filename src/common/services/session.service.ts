//@ts-nocheck
import { observable, action, reaction } from 'mobx';

import sessionStorage from './session.storage.service';
import AuthService from '../../auth/AuthService';
import NavigationService from '../../navigation/NavigationService';
import { getStores } from '../../../AppStores';
import logService from './log.service';
import type UserModel from '../../channel/UserModel';

/**
 * Session service
 */
class SessionService {
  @observable userLoggedIn = false;

  /**
   * Session token
   */
  token = '';

  /**
   * Refresh token
   */
  refreshToken = '';

  /**
   * User guid
   */
  guid = null;

  /**
   * Session storage service
   */
  sessionStorage = null;

  /**
   * Initial screen
   */
  initialScreen = 'Capture';

  @observable refreshingTokens = false;

  /**
   * Constructor
   * @param {object} sessionStorage
   */
  constructor(sessionStorage) {
    this.sessionStorage = sessionStorage;
  }

  /**
   * Init service
   */
  async init() {
    try {
      const [
        accessToken,
        refreshToken,
        user,
      ] = await this.sessionStorage.getAll();

      // if there is no session active we clean up and return;
      if (!accessToken) {
        this.setToken(null);
        this.setRefreshToken(null);
        return null;
      }

      const { access_token, access_token_expires } = accessToken;
      const { refresh_token, refresh_token_expires } = refreshToken;

      this.setRefreshToken(refresh_token);
      this.setToken(access_token);

      if (!access_token) {
        return null;
      }

      if (
        access_token_expires * 1000 < Date.now() &&
        refresh_token &&
        refresh_token_expires * 1000 > Date.now()
      ) {
        logService.info('[SessionService] refreshing token');
        return await AuthService.refreshToken();
      }

      // ensure user loaded before activate the session
      await this.loadUser(user);

      // refresh the token
      await AuthService.refreshToken();

      this.setLoggedIn(true);

      return access_token;
    } catch (e) {
      this.setToken(null);
      this.setRefreshToken(null);
      logService.exception('[SessionService] error getting tokens', e);
      return null;
    }
  }

  async loadUser(user) {
    if (user) {
      getStores().user.setUser(user);
      // we update the user without wait
      getStores().user.load(true).then(user => {
        if (user) sessionStorage.setUser(user);
      });
    } else {
      user = await getStores().user.load();
      sessionStorage.setUser(user);
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
   */
  setInitialScreen(screen) {
    this.initialScreen = screen;
  }

  /**
   * Parse jwt
   * @param {string} token
   */
  parseJwt(token) {
    try {
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
  setLoggedIn(value) {
    this.userLoggedIn = value;
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
   * Login
   * @param {string} token
   * @param {boolean} loadUser
   */
  @action
  async login(tokens, loadUser = true) {
    this.setToken(tokens.access_token);
    this.setRefreshToken(tokens.refresh_token);

    // ensure user loaded before activate the session
    if (loadUser) {
      await this.loadUser();
    }

    this.setLoggedIn(true);

    const token_expire = this.getTokenExpiration(tokens.access_token);
    const token_refresh_expire = token_expire + 60 * 60 * 24 * 30;

    this.sessionStorage.setAccessToken(tokens.access_token, token_expire);
    this.sessionStorage.setRefreshToken(
      tokens.refresh_token,
      token_refresh_expire,
    );
  }

  async badAuthorization() {
    if (this.refreshingTokens || !this.token || !this.refreshToken) return;
    this.refreshingTokens = true;
    this.setToken(null);
    try {
      await AuthService.refreshToken();
      this.refreshingTokens = false; // on success
      return !!this.token;
      // Same session should not need to refresh anyay
    } catch {
      this.promptLogin();
      setTimeout(() => {
        this.refreshingTokens = false;
      }, 1500);
    }
  }

  promptLogin() {
    //this.logout();
    this.guid = null;
    this.setToken(null);
    this.setLoggedIn(false);
    NavigationService.jumpTo('Auth');
  }

  refresh(tokens) {
    this.setToken(tokens.access_token);
    this.sessionStorage.setAccessToken(tokens.access_token);
    this.sessionStorage.setRefreshToken(tokens.refresh_token);
  }

  /**
   * Logout
   */
  logout() {
    this.guid = null;
    this.setToken(null);
    this.setRefreshToken(null);
    this.setLoggedIn(false);
    this.sessionStorage.clear();
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
   * There is a user logged in?
   */
  isLoggedIn() {
    return this.token !== null;
  }

  /**
   * Clear messenger keys
   */
  clearMessengerKeys() {
    return sessionStorage.clearPrivateKey();
  }
}

export default new SessionService(sessionStorage);
