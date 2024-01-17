import api, { ApiResponse } from '../common/services/api.service';
import session from '../common/services/session.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';
import type UserModel from '../channel/UserModel';
import { resetStackAndGoBack } from './multi-user/resetStackAndGoBack';
import NavigationService from '../navigation/NavigationService';
import i18n from '../common/services/i18n.service';
import { showNotification } from 'AppMessages';
import { action, observable } from 'mobx';
import mindsConfigService from '~/common/services/minds-config.service';
import CookieManager, { Cookies } from '@react-native-cookies/cookies';

export type TFA = 'sms' | 'totp';

export interface RegisterResponse extends ApiResponse {
  guid: string;
  user: UserModel;
}

interface ForgotResponse extends ApiResponse {}

interface ValidateResponse extends ApiResponse {}

interface ResetResponse extends ApiResponse {}

export type RegisterParams = {
  username: string;
  email: string;
  password: string;
  exclusive_promotions: boolean;
  friendly_captcha_enabled?: boolean;
};

type ResetParams = {
  username: string;
  code: string;
  password: string;
};

type ForgotParams = {
  username: string;
};

type ValidateParams = {
  password: string;
};

type LoginUserResponse = {
  permissions: string[];
  status: 'success' | 'error';
  user: UserModel;
  pseudoId?: string;
};

/**
 * Auth Services
 */
class AuthService {
  @observable justRegistered = false;
  @observable onboardCompleted = false;
  showLoginPasswordModal: null | Function = null;

  @action
  setCompletedOnboard() {
    this.onboardCompleted = true;
  }

  /**
   * Login user
   *
   * @param username username
   * @param password password
   * @param newUser it's a new registered user
   */
  async login(username: string, password: string, newUser: boolean = false) {
    this.justRegistered = newUser;
    // ignore if already logged in
    this.checkUserExist(username);

    const isFirstLogin = session.sessionsCount === 0;

    // if already have other sessions...
    if (!isFirstLogin) {
      session.setSwitchingAccount(true);
    }

    await api.updateXsrfToken();
    const { data } = await api.rawPost<LoginUserResponse>(
      'api/v1/authenticate',
      {
        username,
        password,
      },
    );

    if (!data) {
      console.log('[AuthService] login: no data');
      return null;
    }

    const cookies = await CookieManager.get('https://www.minds.com');

    if (session.isRelogin(username, data, cookies)) {
      return data;
    }

    await delay(100);

    await session.addSession(data, cookies);
    await session.login();
    await mindsConfigService.update();

    // if this is not the first login we reset the stack keeping the login screen and the main only.
    // To force rendering the app behind the modal and get rid of the splash screen
    if (!isFirstLogin) {
      resetStackAndGoBack();
    }

    session.setSwitchingAccount(false);

    return data;
  }

  /**
   * Check if the user is already logged
   */
  checkUserExist(username: string) {
    if (
      session.sessions.some(
        token => token.user.username === username && !token.sessionExpired,
      )
    ) {
      throw new Error(i18n.t('auth.alreadyLogged'));
    }
  }

  async loginWithIndex(sessionIndex: number) {
    console.log('[AuthService] loginWithIndex', sessionIndex);
    session.setSwitchingAccount(true);
    // await this.sessionLogout();
    // await api.clearCookies();
    await delay(100);
    await session.switchUser(sessionIndex);
    await session.login();
    resetStackAndGoBack();
    session.setSwitchingAccount(false);
  }

  /**
   * Logs in with a given user id. Used in multi-user functionality
   * @param guid user guid
   * @param callback the callback to be called on success
   */
  async loginWithGuid(guid: string, callback: Function) {
    const index = session.getIndexSessionFromGuid(guid);

    if (index !== false) {
      await this.loginWithIndex(index);
      callback();
    } else {
      logService.exception('[AuthService] loginWithGuid');
    }
  }

  async handleActiveAccount() {
    // if after logout we have other accounts...
    if (session.sessionsCount > 0) {
      await delay(100);
      await session.switchUser(session.activeIndex);
      await session.login();
      resetStackAndGoBack();
    }
  }

  /**
   * Disable channel
   */
  async disable() {
    try {
      await this.logout(() => api.delete('api/v1/channel'));
    } catch (e) {
      showNotification('Error disabling the channel');
    }
  }

  /**
   * Delete channel
   */
  async delete(password) {
    try {
      await this.logout(() => api.post('api/v2/settings/delete', { password }));
    } catch (e) {
      showNotification('Error deleting the channel');
    }
  }

  /**
   * Logout user
   */
  async logout(preLogoutCallBack?: () => void): Promise<boolean> {
    this.justRegistered = false;
    this.onboardCompleted = false;
    try {
      if (session.sessionsCount > 0) {
        const state = NavigationService.getCurrentState();
        if (state && state.name !== 'MultiUserScreen') {
          NavigationService.navigate('MultiUserScreen');
        }
      }

      if (preLogoutCallBack) {
        await preLogoutCallBack();
      }
      // Logout and handle user switching or navigating to welcome screen
      this.logoutSession();

      return true;
    } catch (err) {
      session.setSwitchingAccount(false);
      logService.exception('[AuthService] logout', err);
      return false;
    }
  }

  /**
   * Logout session and handle user switching or navigating to welcome screen
   */
  private async logoutSession() {
    session.setSwitchingAccount(true);
    session.logout();

    // Fixes auto-subscribe issue on register
    await api.clearCookies();
    await this.handleActiveAccount();
    session.setSwitchingAccount(false);
  }

  /**
   * Opens the re-login modal for the current user and handles a successful login or the cancel
   */
  async tryToRelog(onLogin?: Function) {
    const onCancel = async () => {
      console.log('[AuthService] tryToRelog: session expired');
      this.logoutSession();
    };

    NavigationService.navigate('RelogScreen', {
      onLogin,
      onCancel,
    });
  }

  /**
   * Logout user specified by index on session
   */
  async logoutFrom(index: number): Promise<boolean> {
    this.justRegistered = false;
    this.onboardCompleted = false;
    try {
      session.setSwitchingAccount(true);
      const logoutActive = session.logoutFrom(index);

      // Fixes auto-subscribe issue on register
      await api.clearCookies();
      if (logoutActive) {
        await this.handleActiveAccount();
      }
      session.setSwitchingAccount(false);
      return true;
    } catch (err) {
      session.setSwitchingAccount(false);
      logService.exception('[AuthService] logoutFrom', err);
      return false;
    }
  }

  /**
   * This methods logs out the current session but WITHOUt removing it from the storage
   * @returns boolean
   */
  async sessionLogout(newUser: boolean = false) {
    try {
      this.justRegistered = newUser;
      this.onboardCompleted = false;
      session.logout(false);
      // Fixes auto-subscribe issue on register
      await api.clearCookies();
      return true;
    } catch (err) {
      logService.exception('[AuthService] sessionLogout', err);
      return false;
    }
  }

  /**
   * Logout user from all devices
   */
  async logoutAll(): Promise<boolean> {
    try {
      await api.delete('api/v1/authenticate/all');
      session.logout();

      // Fixes auto-subscribe issue on register
      await api.clearCookies();

      return true;
    } catch (err) {
      logService.exception('[AuthService] logoutAll', err);
      return false;
    }
  }

  /**
   * Register user and returns UserModel
   * @param params
   */
  async register(params: RegisterParams): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>(
        'api/v1/register',
        params,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Request to reset password, returns suceed or fail
   * @param username
   */
  forgot(username: string): Promise<ForgotResponse> {
    const params = { username } as ForgotParams;
    return api.post('api/v1/forgotpassword/request', params);
  }
  /**
   * Set new password validating with code
   * @param username
   * @param password
   * @param code
   */
  reset(
    username: string,
    password: string,
    code: string,
  ): Promise<ResetResponse> {
    const params = {
      username,
      code,
      password,
    } as ResetParams;

    return api.post('api/v1/forgotpassword/reset', params, {
      Authorization: undefined, // we want this request to be without authorization
    });
  }
  /**
   * Validate Password, return succeed or fail
   * @param password
   */
  validatePassword(password: string): Promise<ValidateResponse> {
    const params = { password } as ValidateParams;
    return api.post('api/v2/settings/password/validate', params);
  }
}

export default new AuthService();

CookieManager.setFromCookies = async (url: string, cookies: Cookies) =>
  Promise.all(
    Object.keys(cookies).map(async key =>
      CookieManager.set(url, { ...cookies[key] }),
    ),
  );
