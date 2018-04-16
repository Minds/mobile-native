import { MINDS_URI } from '../config/Config';
import api from './../common/services/api.service';
import session from './../common/services/session.service';

/**
 * Auth Services
 */
class AuthService {

  async login(username, password) {
    let params = {
      grant_type: 'password',
      client_id: '',
      client_secret: '',
      username,
      password
    };
    const data = await api.post('oauth2/token', params);
    session.login(data.access_token, data.user_id);
    return data;
  }

  async logout() {
    try {
      await api.post('api/v1/logout', {});
      session.logout();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async twoFactorAuth(token, code) {
    const data = await api.post('api/v1/authenticate/two-factor', { token, code });
    session.login(data.access_token);
    return data;
  }

  forgot(username) {
    return api.post('api/v1/forgotpassword/request', { username });
  }
}

export default new AuthService();