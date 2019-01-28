import { AsyncStorage } from 'react-native';
import {
  observable,
  action,
  reaction
} from 'mobx'

import sessionStorage from './session.storage.service';
import AuthService from '../../auth/AuthService';
import NavigationService from '../../navigation/NavigationService';
import appStores from '../../../AppStores';

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
  initialScreen = 'Tabs';

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

      const { access_token, access_token_expires } = await this.sessionStorage.getAccessToken();
      const { refresh_token, refresh_token_expires } = await this.sessionStorage.getRefreshToken();

      this.setRefreshToken(refresh_token);
      this.setToken(access_token);

      if (!access_token) return null;

      if (
        access_token_expires * 1000 < Date.now()
        && refresh_token
        && refresh_token_expires * 1000 > Date.now()
      ) {
        console.log('refreshing token');
        return await AuthService.refreshToken();
      }

      // ensure user loaded before activate the session
      await this.loadUser();

      this.setLoggedIn(true);

      return access_token;
    } catch (e) {
      this.setToken(null);
      console.log('error getting tokens', e);
      return null;
    }
  }

  async loadUser() {
    let user = await sessionStorage.getUser();

    if (user) {
      appStores.user.setUser(user);
      // we update the user without wait
      appStores.user.load(true).then(user => {
        if (user) sessionStorage.setUser(user);
      });
    } else {
      user = await appStores.user.load();
      sessionStorage.setUser(user);
    }

    this.guid = user.guid;
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
   * @param {string} guid
   */
  @action
  async login(tokens) {
    this.setToken(tokens.access_token);
    this.setRefreshToken(tokens.refresh_token);

    // ensure user loaded before activate the session
    await this.loadUser();

    this.setLoggedIn(true);

    const token_expire = this.getTokenExpiration(tokens.access_token);
    const token_refresh_expire = token_expire + (60 * 60 * 24 * 30);

    this.sessionStorage.setAccessToken(tokens.access_token, token_expire);
    this.sessionStorage.setRefreshToken(tokens.refresh_token, token_refresh_expire);
  }

  async badAuthorization() {
    if (this.refreshingTokens)
      return;
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
    NavigationService.reset('Login');
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
      args => fn(...args),
      { fireImmediately: true }
    );
  }

  /**
   * Run on session change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onLogin(fn) {
    return reaction(
      () => this.userLoggedIn ? this.token : null,
      token => {
        if (token) {
          fn(token);
        }
      },
      { fireImmediately: true }
    );
  }

  /**
   * Run on session
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onLogout(fn) {
    return reaction(
      () => this.userLoggedIn ? this.token : null,
      token => {
        if (!token) {
          fn(token);
        }
      },
      { fireImmediately: false }
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
