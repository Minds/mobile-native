import { AsyncStorage } from 'react-native';
import {
  observable,
  action,
  autorun
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
      .then(token => {
        this.setToken(token);
        return token;
      });
  }

  @action
  setToken(token) {
    this.token = token;
  }

  /**
   * Login
   * @param {string} token
   */
  login(token) {
    this.setToken(token)
    this.sessionStorage.setAccessToken(token);
  }

  /**
   * Logout
   */
  logout() {
    this.setToken(null);
    this.sessionStorage.clear();
  }


  /**
   * Run on session change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onSession(fn) {
    return autorun(() => {
      fn(this.token);
    });
  }

  /**
   * Run on session change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onLogin(fn) {
    return autorun(() => {
      if (this.token) {
        fn(this.token);
      }
    });
  }

  /**
   * Run on session
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onLogout(fn) {
    return autorun(() => {
      if (!this.token) {
        fn(this.token);
      }
    });
  }

  /**
   * There is a user logged in?
   */
  isLoggedIn() {
    return this.token !== null;
  }
}

export default new SessionService(sessionStorage);