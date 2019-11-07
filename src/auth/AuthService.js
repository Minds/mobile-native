import api from './../common/services/api.service';
import session from './../common/services/session.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';

/**
 * Auth Services
 */
class AuthService {

  async login(username, password) {
    let params = {
      grant_type: 'password',
      client_id: 'mobile',
      //client_secret: '',
      username,
      password
    };

    const data = await api.post('api/v2/oauth/token', params);
    await api.clearCookies();
    await delay(100);
    await session.login(data);
    return data;
  }

  async logout() {
    try {
      let resp = await api.delete('api/v2/oauth/token');
      session.logout();
      return true;
    } catch (err) {
      logService.exception('[AuthService] logout', err);
      return false;
    }
  }

  async refreshToken() {
    logService.info('[AuthService] Refreshing token');
    let params = {
      grant_type: 'refresh_token',
      client_id: 'mobile',
      //client_secret: '',
      refresh_token: session.refreshToken,
    };
    try {
      const data = await api.post('api/v2/oauth/token', params);
      session.login(data);
      return data.access_token;
    } catch (err) {
      logService.exception('[AuthService] error claiming refresh token', err);
      throw err;
    }
  }

  async twoFactorAuth(token, code) {
    const data = await api.post('api/v1/authenticate/two-factor', { token, code });
    //session.login(data.access_token);
    return data;
  }

  register(params) {
    return api.post('api/v1/register', params);
  }

  forgot(username) {
    return api.post('api/v1/forgotpassword/request', { username });
  }

  reset(username, password, code) {
    return api.post('api/v1/forgotpassword/reset', { username, code, password });
  }

  validatePassword(password) {
    return api.post('api/v2/settings/password/validate', { password });
  }
}

export default new AuthService();
