import { observable, action, computed, reaction } from 'mobx';
import {
  SessionStorageService,
  Session,
} from './storage/session.storage.service';
import { getStores } from '../../../AppStores';
import logService from './log.service';
import type UserModel from '../../channel/UserModel';
import { createUserStore } from './storage/storages.service';
import SettingsStore from '../../settings/SettingsStore';
import apiService, { ApiService } from './api.service';
import analyticsService from './analytics.service';
import { IS_TENANT } from '../../config/Config';
import { Cookies, cookieService } from '~/auth/CookieService';

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

  /**
   * User guid
   */
  guid: string | null = null;

  /**
   * Session storage service
   */
  sessionStorage: SessionStorageService;

  /**
   * user's Cookies
   */

  cookies: Cookies | undefined = undefined;

  /**
   * Initial screen
   */
  initialScreen = '';

  /**
   * Initial screen params
   */
  initialScreenParams: undefined | { [key: string]: any } = undefined;

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
      if (!sessionData || (sessionData.data?.length ?? 0) === 0) {
        this.setCookies();
        this.setReady();
        return null;
      }

      this.setActiveIndex(sessionData.activeIndex);
      this.setSessions(sessionData.data);

      const { user, cookies } = this.sessions[this.activeIndex];

      // set the analytics pseudo id (if not tenant)
      analyticsService.setUserId(
        IS_TENANT ? user.guid : cookies?.minds_pseudoid?.value ?? '',
      );
      this.setCookies(cookies);

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

      return this.cookies;
    } catch (e) {
      this.setCookies();
      logService.exception('[SessionService] error getting cookies', e);
      return null;
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
   * Set cookies
   */
  setCookies(cookies?: Cookies) {
    this.cookies = { ...cookies };
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
   * Add new data info from login;
   * @param data
   */
  async addSession(data, cookies: Cookies) {
    try {
      this.setCookies(cookies);
      await this.loadUser(data.user);

      // get session data from tokens returned by login
      const sessionData = this.buildSessionData(data, cookies);

      // add data to current tokens data array
      const sessions = this.sessions;
      sessions.push(sessionData);
      this.setSessions(sessions);

      analyticsService.setUserId(
        IS_TENANT
          ? sessionData.user.guid
          : sessionData.cookies?.minds_pseudoid?.value,
      );

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
    const session = this.sessions[sessionIndex];
    if (session.cookies) {
      await cookieService.setFromCookies(session.cookies);
      apiService.xsrfToken = session.cookies['XSRF-TOKEN'].value;
    }
    await this.loadUser(session.user);
    analyticsService.setUserId(
      IS_TENANT
        ? session.user.guid
        : session.cookies?.minds_pseudoid?.value ?? '',
    );
    // persist index
    this.persistActiveIndex();
  }

  buildSessionData(data, cookies: Cookies) {
    const { user = getStores().user.me } = data;
    return {
      user,
      cookies,
      sessionExpired: false,
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
  isRelogin(username: string, data, cookies: Cookies) {
    const index = this.sessions.findIndex(
      value => value.user.username === username,
    );

    if (index !== -1) {
      // TODO: check if data are still valid
      const sessionData = this.buildSessionData(data, cookies);
      this.sessions[index] = sessionData;
      this.setCookies(cookies);
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
    this.setCookies();
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
      () => [this.userLoggedIn ? this.cookies : null],
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
      () => (this.userLoggedIn ? this.cookies : null),
      async cookies => {
        if (cookies) {
          try {
            await fn(cookies);
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
      () => (this.userLoggedIn ? this.cookies : null),
      async cookies => {
        if (!cookies) {
          try {
            await fn(cookies);
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
}

export default new SessionService(new SessionStorageService());
