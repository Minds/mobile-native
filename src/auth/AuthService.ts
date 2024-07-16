import { ApiService } from './../common/services/api.service';
import { ApiResponse } from '~/common/services/ApiResponse';
import delay from '../common/helpers/delay';
import type UserModel from '../channel/UserModel';
import { resetStackAndGoBack } from './multi-user/resetStackAndGoBack';
import { showNotification } from 'AppMessages';
import { action, observable } from 'mobx';
import { AuthType } from '~/common/services/storage/session.storage.service';
import type { LogService } from '~/common/services/log.service';
import type { SessionService } from '~/common/services/session.service';
import type { NavigationService } from '~/navigation/NavigationService';
import sp from '~/services/serviceProvider';

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
  friendly_captcha_enabled?: boolean;
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
export class AuthService {
  @observable justRegistered = false;
  @observable onboardCompleted = false;

  @action
  setCompletedOnboard() {
    this.onboardCompleted = true;
  }

  constructor(
    private api: ApiService,
    private log: LogService,
    private session: SessionService,
    private navigation: NavigationService,
  ) {}

  /**
   * Login user
   *
   * @param username username
   * @param password password
   * @param newUser it's a new registered user
   */
  async login(username: string, password: string, newUser: boolean = false) {
    const params = {
      grant_type: 'password',
      client_id: 'mobile',
      //client_secret: '',
      username,
      password,
    } as loginParms;

    this.justRegistered = newUser;

    // ignore if already logged in
    this.checkUserExist(username);

    const { data, headers: responseHeaders } =
      await this.api.rawPost<LoginResponse>('api/v3/oauth/token', params);

    if (responseHeaders && responseHeaders['set-cookie']) {
      const regex = /minds_pseudoid=([^;]*);/g;
      const result = regex.exec(responseHeaders['set-cookie'].join());
      if (result && result[1]) {
        data.pseudo_id = result[1];
      }
    }

    if (this.session.isRelogin(username, data)) {
      return data;
    }

    const isFirstLogin = this.session.sessionsCount === 0;

    // if already have other sessions...
    if (!isFirstLogin) {
      this.session.setSwitchingAccount(true);
      this.sessionLogout(newUser);
    }

    await this.api.clearCookies();
    await delay(100);

    await this.session.addOAuthSession(data);
    await this.session.login();
    await sp.config.update();

    // if this is not the first login we reset the stack keeping the login screen and the main only.
    // To force rendering the app behind the modal and get rid of the splash screen
    if (!isFirstLogin) {
      resetStackAndGoBack();
    }

    this.session.setSwitchingAccount(false);

    return data;
  }

  /**
   * Check if the user is already logged
   */
  checkUserExist(username: string) {
    if (
      this.session.sessions.some(
        token => token.user.username === username && !token.sessionExpired,
      )
    ) {
      throw new Error(sp.i18n.t('auth.alreadyLogged'));
    }
  }

  async loginWithIndex(sessionIndex: number) {
    this.session.setSwitchingAccount(true);
    await this.sessionLogout();
    await this.api.clearCookies();
    await delay(100);
    await this.session.switchUser(sessionIndex);
    await this.session.login();
    resetStackAndGoBack();
    this.session.setSwitchingAccount(false);
  }

  /**
   * Logs in with a given user id. Used in multi-user functionality
   * @param guid user guid
   * @param callback the callback to be called on success
   */
  async loginWithGuid(guid: string, callback: Function) {
    const index = this.session.getIndexSessionFromGuid(guid);

    if (index !== false) {
      await this.loginWithIndex(index);
      callback();
    } else {
      this.log.exception('[AuthService] loginWithGuid');
    }
  }

  async handleActiveAccount() {
    // if after logout we have other accounts...
    if (this.session.sessionsCount > 0) {
      await delay(100);
      await this.session.switchUser(this.session.activeIndex);
      await this.session.login();
      resetStackAndGoBack();
    }
  }

  /**
   * Disable channel
   */
  async disable() {
    try {
      await this.logout(() => this.api.delete('api/v1/channel'));
    } catch (e) {
      showNotification('Error disabling the channel');
    }
  }

  /**
   * Delete channel
   */
  async delete(password) {
    try {
      await this.logout(() =>
        this.api.post('api/v2/settings/delete', { password }),
      );
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
      if (this.session.sessionsCount > 0) {
        const state = this.navigation.getCurrentState();
        if (state && state.name !== 'MultiUserScreen') {
          this.navigation.navigate('MultiUserScreen');
        }
      }

      // delete device token first
      await this.unregisterTokenFrom(this.session.activeIndex);

      if (preLogoutCallBack) {
        await preLogoutCallBack();
      }

      this.api.post('api/v3/oauth/revoke');

      // Logout and handle user switching or navigating to welcome screen
      this.logoutSession();

      return true;
    } catch (err) {
      this.session.setSwitchingAccount(false);
      this.log.exception('[AuthService] logout', err);
      return false;
    }
  }

  /**
   * Logout session and handle user switching or navigating to welcome screen
   */
  private async logoutSession() {
    this.session.setSwitchingAccount(true);
    this.session.logout();

    // Fixes auto-subscribe issue on register
    await this.api.clearCookies();
    await this.handleActiveAccount();
    this.session.setSwitchingAccount(false);
  }

  /**
   * Revoke tokens and relogin (The current user session)
   */
  async revokeTokens(): Promise<boolean> {
    this.justRegistered = false;
    this.onboardCompleted = false;

    try {
      if (this.session.sessionsCount > 0) {
        const state = this.navigation.getCurrentState();
        if (state && state.name !== 'MultiUserScreen') {
          this.navigation.navigate('MultiUserScreen');
          await delay(100);
        }
      }
      // delete device token first
      await this.unregisterTokenFrom(this.session.activeIndex);

      this.session.setSwitchingAccount(true);
      // revoke local session
      this.session.setSessionExpired(true);

      this.tryToRelog(() => {
        this.session.setSessionExpired(false);
        this.navigation.goBack();
      });

      return true;
    } catch (err) {
      this.session.setSwitchingAccount(false);
      this.log.exception('[AuthService] revokeTokens', err);
      return false;
    }
  }

  /**
   * Opens the re-login modal for the current user and handles a successful login or the cancel
   */
  async tryToRelog(onLogin?: Function) {
    const onCancel = async () => {
      console.log('[AuthService] tryToRelog: session expired');
      this.logoutSession();
    };

    const currentSession = this.session.getSessionForIndex(
      this.session.activeIndex,
    );

    if (currentSession.authType === AuthType.Cookie) {
      await onCancel();
      return;
    }

    this.navigation.navigate('RelogScreen', {
      onLogin,
      onCancel,
    });
  }

  /**
   * Unregister the push token for a session index
   */
  async unregisterTokenFrom(index: number) {
    try {
      const deviceToken = this.session.deviceToken;
      if (deviceToken) {
        return await this.session.apiServiceInstances[index].delete(
          `api/v3/notifications/push/token/${deviceToken}`,
        );
      }
    } catch (error) {
      this.log.exception('[AuthService] error unregistering push token', error);
    }
  }

  /**
   * Logout user specified by index on session
   */
  async logoutFrom(index: number): Promise<boolean> {
    this.justRegistered = false;
    this.onboardCompleted = false;
    try {
      await this.unregisterTokenFrom(index);

      // revoke access token from backend
      this.session.apiServiceInstances[index].post('api/v3/oauth/revoke');
      this.session.setSwitchingAccount(true);
      const logoutActive = this.session.logoutFrom(index);

      // Fixes auto-subscribe issue on register
      await this.api.clearCookies();
      if (logoutActive) {
        await this.handleActiveAccount();
      }
      this.session.setSwitchingAccount(false);
      return true;
    } catch (err) {
      this.session.setSwitchingAccount(false);
      this.log.exception('[AuthService] logoutFrom', err);
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
      this.session.logout(false);
      // Fixes auto-subscribe issue on register
      await this.api.clearCookies();
      return true;
    } catch (err) {
      this.log.exception('[AuthService] sessionLogout', err);
      return false;
    }
  }

  /**
   * Logout user from all devices
   */
  async logoutAll(): Promise<boolean> {
    try {
      await this.api.delete('api/v1/authenticate/all');
      await this.api.post('api/v3/oauth/revoke');
      this.session.logout();

      // Fixes auto-subscribe issue on register
      await this.api.clearCookies();

      return true;
    } catch (err) {
      this.log.exception('[AuthService] logoutAll', err);
      return false;
    }
  }

  /**
   * Refresh user token
   */
  async refreshToken(refreshToken?, accessToken?): Promise<LoginResponse> {
    this.log.info('[AuthService] Refreshing token...');

    const params = {
      grant_type: 'refresh_token',
      client_id: 'mobile',
      //client_secret: '',
      refresh_token: refreshToken || this.session.refreshToken,
    } as loginParms;

    const headers = accessToken
      ? this.api.buildAuthorizationHeader(accessToken)
      : {};

    try {
      const data: LoginResponse = await this.api.post<LoginResponse>(
        'api/v3/oauth/token',
        params,
        headers,
      );
      this.log.info('[AuthService] token refreshed');
      return data;
    } catch (err) {
      this.log.exception('[AuthService] error claiming refresh token', err);
      throw err;
    }
  }

  /**
   * Register user and returns UserModel
   * @param params
   */
  async register(params: registerParams): Promise<RegisterResponse> {
    try {
      const response = await this.api.post<RegisterResponse>(
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
    const params = { username } as forgotParams;
    return this.api.post('api/v1/forgotpassword/request', params);
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

    return this.api.post('api/v1/forgotpassword/reset', params, {
      Authorization: undefined, // we want this request to be without authorization
    });
  }
  /**
   * Validate Password, return succeed or fail
   * @param password
   */
  validatePassword(password: string): Promise<ValidateResponse> {
    const params = { password } as validateParams;
    return this.api.post('api/v2/settings/password/validate', params);
  }
}
