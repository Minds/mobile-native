import api, { ApiResponse } from './../common/services/api.service';
import session from './../common/services/session.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';

interface LoginResponse extends ApiResponse {
  access_token: string;
  token_type: string;
}

interface TFAResponse extends ApiResponse {}

type tfaParams = {
  token: string;
  code: string;
};

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

/**
 * Auth Services
 */
class AuthService {
  /**
   * Login user
   * @param username
   * @param password
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const params = {
      grant_type: 'password',
      client_id: 'mobile',
      //client_secret: '',
      username,
      password,
    } as loginParms;

    const data: LoginResponse = await api.post<LoginResponse>(
      'api/v2/oauth/token',
      params,
    );

    await api.clearCookies();
    await delay(100);
    await session.login(data);
    return data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<boolean> {
    try {
      await api.delete('api/v2/oauth/token');
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
   * Logout user from all devices
   */
  async logoutAll(): Promise<boolean> {
    try {
      await api.delete('api/v1/authenticate/all');
      await api.delete('api/v2/oauth/token');
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
  async refreshToken(): Promise<string> {
    logService.info('[AuthService] Refreshing token');

    const params = {
      grant_type: 'refresh_token',
      client_id: 'mobile',
      //client_secret: '',
      refresh_token: session.refreshToken,
    } as loginParms;

    try {
      const data: LoginResponse = await api.post<LoginResponse>(
        'api/v2/oauth/token',
        params,
      );

      session.login(data, false);
      return data.access_token;
    } catch (err) {
      logService.exception('[AuthService] error claiming refresh token', err);
      throw err;
    }
  }

  async twoFactorAuth(token: string, code: string): Promise<TFAResponse> {
    const params = {
      token,
      code,
    } as tfaParams;

    const data: TFAResponse = await api.post<TFAResponse>(
      'api/v1/authenticate/two-factor',
      params,
    );

    return data;
  }

  register(params: registerParams) {
    return api.post('api/v1/register', params);
  }

  forgot(username) {
    return api.post('api/v1/forgotpassword/request', { username });
  }

  reset(username, password, code) {
    return api.post('api/v1/forgotpassword/reset', {
      username,
      code,
      password,
    });
  }

  validatePassword(password) {
    return api.post('api/v2/settings/password/validate', { password });
  }
}

export default new AuthService();
