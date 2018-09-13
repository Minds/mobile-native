import { Alert } from 'react-native';
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
      client_id: 'mobile',
      client_secret: '6YursnbGM4ztg2TIyoTal+IUjkGb/GrWtxyejczTuQ3HbJ0lBdHdLAceEIk0b9NHq1RI6jpK0eqTq89z1Q1i9TmvmgprGkYGjAJY8uK2reO+s1qWxjkwsC0EydNKv6/uA8/rKQypXX9YcZ9eGiJ9viwbVV0RRTqdVleZ7XAzz6o=',
      username,
      password
    };
    try {
      const data = await api.post('api/v2/oauth/token', params);
      session.login(data);
      return data;
    } catch (err) {
      console.log(params, err);
    }
   
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

  async refreshToken() {
    let params = {
      grant_type: 'refresh_token',
      client_id: 'mobile',
      client_secret: '6YursnbGM4ztg2TIyoTal+IUjkGb/GrWtxyejczTuQ3HbJ0lBdHdLAceEIk0b9NHq1RI6jpK0eqTq89z1Q1i9TmvmgprGkYGjAJY8uK2reO+s1qWxjkwsC0EydNKv6/uA8/rKQypXX9YcZ9eGiJ9viwbVV0RRTqdVleZ7XAzz6o=',
      refresh_token: session.refreshToken,
    };
    try {
      const data = await api.post('api/v2/oauth/token', params);
      session.refresh(data);
      //session.login(data);
      return data;
    } catch (err) {
      console.log('ERROR CLAIMING REFRESH TOKEN', params, err);
    }
  }

  async twoFactorAuth(token, code) {
    const data = await api.post('api/v1/authenticate/two-factor', { token, code });
    session.login(data.access_token);
    return data;
  }

  register(params) {
    return api.post('api/v1/register', params);
  }

  forgot(username) {
    return api.post('api/v1/forgotpassword/request', { username });
  }

  validatePassword(password) {
    return api.post('api/v2/settings/password/validate', { password });
  }
}

export default new AuthService();
