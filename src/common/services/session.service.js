import { AsyncStorage } from 'react-native';
import {
  observable,
  action,
  reaction
} from 'mobx'

import sessionStorage from './session.storage.service';
import AuthService from '../../auth/AuthService';
import NavigationService from '../../navigation/NavigationService';

/**
 * Session service
 */
class SessionService {

  /**
   * Session token
   */
  @observable token = '';

  /**
   * Refresh token
   */
  @observable refreshToken = '';

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

  refreshingTokens = false;

  /**
   * Constructor
   * @param {object} sessionStorage
   */
  constructor(sessionStorage) {
    this.sessionStorage = sessionStorage;
  }

  async init() {
    try {
      const { access_token, access_token_expires } = await this.sessionStorage.getAccessToken();
      const { refresh_token, refresh_token_expires }  = await this.sessionStorage.getRefreshToken();
      console.log(refresh_token);
      if (
        access_token_expires < Date.now()
        && refresh_token
        && refresh_token_expires > Date.now()
      ) {
        console.log('refreshing token');
        this.refreshToken = refresh_token;
        return await AuthService.refreshToken();
      }

      this.setToken(access_token);

      return access_token;
    } catch (e) {
      this.setToken(null);
      console.log('error getting tokens', e);
      return null;
    }
  }

  setInitialScreen(screen) {
    this.initialScreen = screen;
  }

  @action
  setToken(token) {
    this.token = token;
  }

  /**
   * Login
   * @param {string} token
   * @param {string} guid
   */
  @action
  login(tokens) {
    this.setToken(tokens.access_token);
    const hour = 60 * 60;
    const month = 60 * 60 * 24 * 30;
    this.sessionStorage.setAccessToken(tokens.access_token, Date.now() + hour);
    this.sessionStorage.setRefreshToken(tokens.refresh_token, Date.now() + month);
  }

  async badAuthorization() {
    if (this.refreshingTokens)
      return;
    this.refreshingTokens = true;
    this.setToken(null);
    try {
      await AuthService.refreshToken();
    } catch {
      this.promptLogin();
    } finally {
      this.refreshingTokens = false;
    }
  }

  promptLogin() {
    this.setToken(null);
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
    this.sessionStorage.clear();
  }


  /**
   * Run on session change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onSession(fn) {
    return reaction(
      () => [this.token],
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
      () => this.token,
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
      () => this.token,
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