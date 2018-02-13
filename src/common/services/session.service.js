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
   * User guid
   */
  guid = null;

  /**
   * Session storage service
   */
  sessionStorage = null;

  /**
   * Constructor
   * @param {object} sessionStorage
   */
  constructor(sessionStorage) {
    this.sessionStorage = sessionStorage;
  }

  init() {
    return this.sessionStorage.getAccessToken()
      .then(data => {
        if (!data) return null;
        this.guid = data.guid;
        this.setToken(data.token);
        return data.token;
      });
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
  login(token, guid) {
    this.guid = guid;
    this.setToken(token)
    this.sessionStorage.setAccessToken(token, guid);
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
}

export default new SessionService(sessionStorage);