import api, { ApiResponse } from './../common/services/api.service';
import session from './../common/services/session.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';
import type UserModel from '../channel/UserModel';
import { resetStackAndGoBack } from './multi-user/resetStackAndGoBack';
import NavigationService from '../navigation/NavigationService';
import sessionService from './../common/services/session.service';
import i18n from '../common/services/i18n.service';

export type TFA = 'sms' | 'totp';

interface LoginResponse extends ApiResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  pseudo_id: string;
}

export interface RegisterResponse extends ApiResponse {
  guid: string;
  user: UserModel;
}

interface ForgotResponse extends ApiResponse {}

interface ValidateResponse extends ApiResponse {}

interface ResetResponse extends ApiResponse {}

type loginParms = {
  username: string;
  password: string;
  grant_type: string;
  client_id: string;
  refresh_token: string;
};

export type registerParams = {
  username: string;
  email: string;
  password: string;
  exclusive_promotions: boolean;
};

type resetParams = {
  username: string;
  code: string;
  password: string;
};

type forgotParams = {
  username: string;
};

type validateParams = {
  password: string;
};

/**
 * Auth Services
 */
class AuthService {
  justRegistered = false;
  showLoginPasswordModal: null | Function = null;

  /**
   * Login user
   * @param username
   * @param password
   * @param headers
   * @param sessionIndex the index in where the user data is stored
   */
  async login(username: string, password: string, headers: any = {}) {
    const params = {
      grant_type: 'password',
      client_id: 'mobile',
      //client_secret: '',
      username,
      password,
    } as loginParms;

    // ignore if already logged in
    this.checkUserExist(username);

    const { data, headers: responseHeaders } = await api.rawPost<LoginResponse>(
      'api/v3/oauth/token',
      params,
      headers,
    );

    if (session.isRelogin(username, data)) {
      return data;
    }

    if (responseHeaders && responseHeaders['set-cookie']) {
      const regex = /minds_psudeoid=([^;]*);/g;
      const result = regex.exec(responseHeaders['set-cookie'].join());
      if (result && result[1]) {
        data.pseudo_id = result[1];
      }
    }

    const isFirstLogin = session.tokensData.length === 0;

    // if already have other sessions...
    if (!isFirstLogin) {
      session.setSwitchingAccount(true);
      this.sessionLogout();
    } else {
      NavigationService.goBack();
    }

    await api.clearCookies();
    await delay(100);

    await session.addSession(data);
    await session.login();
    session.setSwitchingAccount(false);

    // if this is not the first login we reset the stack keeping the login screen and the main only.
    // To force rendering the app behind the modal and get rid of the splash screen
    if (!isFirstLogin) {
      resetStackAndGoBack();
    }

    return data;
  }

  /**
   * Check if the user is already logged
   */
  checkUserExist(username: string) {
    if (session.tokensData.some(token => token.user.username === username)) {
      throw new Error(i18n.t('auth.alreadyLogged'));
    }
  }

  async reLogin(password: string, headers: any = {}) {
    const username = session.getUser().username;
    const params = {
      grant_type: 'password',
      client_id: 'mobile',
      //client_secret: '',
      username,
      password,
    } as loginParms;

    await api.post<LoginResponse>('api/v3/oauth/token', params, headers);
  }

  async loginWithIndex(sessionIndex: number) {
    session.setSwitchingAccount(true);
    await this.sessionLogout();
    await api.clearCookies();
    await delay(100);
    await session.switchUser(sessionIndex);
    await session.login();
    session.setSwitchingAccount(false);
    resetStackAndGoBack();
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
    if (session.tokensData.length > 0) {
      await delay(100);
      await session.switchUser(session.activeIndex);
      await session.login();
      resetStackAndGoBack();
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<boolean> {
    this.justRegistered = false;
    try {
      if (session.tokensData.length > 0) {
        const state = NavigationService.getCurrentState();
        if (state && state.name === 'Settings') {
          NavigationService.navigate('MultiUserScreen');
        }
      }

      // delete device token first
      await this.unregisterTokenFrom(sessionService.activeIndex);

      api.post('api/v3/oauth/revoke');
      session.setSwitchingAccount(true);
      session.logout();

      // Fixes auto-subscribe issue on register
      await api.clearCookies();
      await this.handleActiveAccount();
      session.setSwitchingAccount(false);
      return true;
    } catch (err) {
      session.setSwitchingAccount(false);
      logService.exception('[AuthService] logout', err);
      return false;
    }
  }

  unregisterTokenFrom(index: number) {
    const deviceToken = sessionService.deviceToken;
    if (deviceToken) {
      return sessionService.apiServiceInstances[index].delete(
        `api/v3/notifications/push/token/${deviceToken}`,
      );
    }
  }

  /**
   * Logout user specified by index on session
   */
  async logoutFrom(index: number): Promise<boolean> {
    this.justRegistered = false;
    try {
      await this.unregisterTokenFrom(index);

      // revoke access token from backend
      sessionService.apiServiceInstances[index].post('api/v3/oauth/revoke');
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
      logService.exception('[AuthService] logout', err);
      return false;
    }
  }

  async sessionLogout() {
    try {
      this.justRegistered = false;
      session.logout(false);
      // Fixes auto-subscribe issue on register
      await api.clearCookies();
      return true;
    } catch (err) {
      logService.exception('[AuthService] logout', err);
      return false;
    }
  }

  /**
   * Logout user from all devices
   */
  async logoutAll(): Promise<boolean> {
    try {
      await api.delete('api/v1/authenticate/all');
      await api.post('api/v3/oauth/revoke');
      session.logout();

      // Fixes auto-subscribe issue on register
      await api.clearCookies();

      return true;
    } catch (err) {
      logService.exception('[AuthService] logout', err);
      return false;
    }
  }

  /**
   * Refresh user token
   */
  async refreshToken(refreshToken?, accessToken?): Promise<LoginResponse> {
    logService.info('[AuthService] Refreshing token');

    const params = {
      grant_type: 'refresh_token',
      client_id: 'mobile',
      //client_secret: '',
      refresh_token: refreshToken || session.refreshToken,
    } as loginParms;

    const headers = accessToken
      ? api.buildAuthorizationHeader(accessToken)
      : {};

    try {
      const data: LoginResponse = await api.post<LoginResponse>(
        'api/v3/oauth/token',
        params,
        headers,
      );
      return data;
    } catch (err) {
      logService.exception('[AuthService] error claiming refresh token', err);
      throw err;
    }
  }

  /**
   * Register user and returns UserModel
   * @param params
   */
  async register(params: registerParams): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>(
        'api/v1/register',
        params,
      );
      this.justRegistered = true;
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
    const params = { username } as forgotParams;
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
    } as resetParams;

    return api.post('api/v1/forgotpassword/reset', params);
  }
  /**
   * Validate Password, return succeed or fail
   * @param password
   */
  validatePassword(password: string): Promise<ValidateResponse> {
    const params = { password } as validateParams;
    return api.post('api/v2/settings/password/validate', params);
  }
}

export default new AuthService();
