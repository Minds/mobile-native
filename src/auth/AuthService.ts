import api, { ApiResponse } from './../common/services/api.service';
import session from './../common/services/session.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';
import type UserModel from '../channel/UserModel';

export const TWO_FACTOR_ERROR =
  'Minds::Core::Security::TwoFactor::TwoFactorRequiredException';

export type TFA = 'sms' | 'totp';

interface LoginResponse extends ApiResponse {
  access_token: string;
  token_type: string;
}

interface TFAResponse extends ApiResponse {}

export interface RegisterResponse extends ApiResponse {
  guid: string;
  user: UserModel;
}

interface ForgotResponse extends ApiResponse {}

interface ValidateResponse extends ApiResponse {}

interface ResetResponse extends ApiResponse {}

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

  /**
   * Login user
   * @param username
   * @param password
   */
  async login(
    username: string,
    password: string,
    headers: any = {},
  ): Promise<LoginResponse> {
    const params = {
      grant_type: 'password',
      client_id: 'mobile',
      //client_secret: '',
      username,
      password,
    } as loginParms;

    const data: LoginResponse = await api.post<LoginResponse>(
      'api/v3/oauth/token',
      params,
      headers,
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
    this.justRegistered = false;
    try {
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
        'api/v3/oauth/token',
        params,
      );

      session.login(data, false);
      return data.access_token;
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
