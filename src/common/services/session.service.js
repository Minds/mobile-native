import { AsyncStorage } from 'react-native';
import {
  observable,
  action,
  reaction
} from 'mobx'

import sessionStorage from './session.storage.service';

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

  /**
   * Constructor
   * @param {object} sessionStorage
   */
  constructor(sessionStorage) {
    this.sessionStorage = sessionStorage;
  }

  async init() {
    try {
      let token = await this.sessionStorage.getAccessToken();
      this.refreshToken = await this.sessionStorage.getRefreshToken();
      console.log(token, this.refreshToken);
      this.setToken(token);
      this.refreshToken = await this.sessionStorage.getRefreshToken();
      return token;
    } catch (e) {
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
  login(tokens) {
    //this.guid = guid;
    this.setToken(tokens.access_token);
    this.sessionStorage.setAccessToken(tokens.access_token);
    this.sessionStorage.setRefreshToken(tokens.refresh_token);
  }

  refresh(tokens) {
    //this.guid = guid;
    this.setToken(tokens.access_token);
    this.sessionStorage.setAccessToken(tokens.access_token);
    this.sessionStorage.setRefreshToken(tokens.refresh_token);
  }

  /**
   * Logout
   */
  logout() {
    console.log('logout issued');
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
      () => [this.token, this.guid],
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
          fn(token, this.guid);
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