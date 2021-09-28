import api, { ApiResponse } from './../common/services/api.service';
import session from './../common/services/session.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';
import type UserModel from '../channel/UserModel';
import RNBootSplash from 'react-native-bootsplash';
import pushService from '../common/services/push.service';
import sessionService from './../common/services/session.service';

export type TFA = 'sms' | 'totp';

interface LoginResponse extends ApiResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
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

  showSplash() {
    RNBootSplash.show({ fade: true });
  }

  hideSplash() {
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 500);
  }

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
    const data = await api.post<LoginResponse>(
      'api/v3/oauth/token',
      params,
      headers,
    );

    if (session.isRelogin(username, data)) {
      return data;
    }

    // if already have other sessions...
    if (session.tokensData.length > 0) {
      this.showSplash();
      this.sessionLogout();
    }

    await api.clearCookies();
    await delay(100);

    await session.addSession(data);
    await session.login();
    this.hideSplash();

    return data;
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

    const data = await api.post<LoginResponse>(
      'api/v3/oauth/token',
      params,
      headers,
    );
  }

  async loginWithIndex(sessionIndex: number) {
    this.showSplash();
    await this.sessionLogout();
    await api.clearCookies();
    await delay(100);
    await session.switchUser(sessionIndex);
    await session.login();
    this.hideSplash();
  }

  async loginWithGuid(guid: string, callback: Function) {
    const index = session.getIndexSessionFromGuid(guid);
    if (index !== false && index !== session.activeIndex) {
      await this.loginWithIndex(index);
      callback();
    }
  }

  async handleActiveAccount() {
    // if after logout we have other accounts...
    if (session.tokensData.length > 0) {
      await delay(100);
      await session.switchUser(session.activeIndex);
      await session.login();
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<boolean> {
    this.justRegistered = false;
    try {
      // delete device token first
      await pushService.push.unregisterTokenFrom(sessionService.activeIndex);

      api.post('api/v3/oauth/revoke');
      this.showSplash();
      session.logout();

      // Fixes autosubscribe issue on register
      await api.clearCookies();
      await this.handleActiveAccount();
      this.hideSplash();
      return true;
    } catch (err) {
      logService.exception('[AuthService] logout', err);
      return false;
    }
  }

  /**
   * Logout user specified by index on session
   */
  async logoutFrom(index: number): Promise<boolean> {
    this.justRegistered = false;
    try {
      // delete device token first
      await pushService.push.unregisterTokenFrom(index);

      // revoke access token from backend
      sessionService.apiServiceInstances[index].post('api/v3/oauth/revoke');

      this.showSplash();
      session.logoutFrom(index);

      // Fixes autosubscribe issue on register
      await api.clearCookies();
      await this.handleActiveAccount();
      this.hideSplash();
      return true;
    } catch (err) {
      logService.exception('[AuthService] logout', err);
      return false;
    }
  }

  async sessionLogout() {
    try {
      this.justRegistered = false;
      session.logout(false);
      // Fixes autosubscribe issue on register
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

      // Fixes autosubscribe issue on register
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
