import { MINDS_URI } from '../config/Config';
import api from './../common/services/api.service';
import session from './../common/services/session.service';

export function login(username, password) {
  let params = {
    grant_type: 'password',
    client_id: '',
    client_secret: '',
    username,
    password
  };
  return api.post('oauth2/token', params).then(data => {
    session.login(data.access_token, data.user_id);
  });
}

export function logout() {
  return api.post('api/v1/logout').then(data => {
    session.logout();
  });
}

export function twoFactorAuth(token, code) {
  return api.post('api/v1/authenticate/two-factor', { token, code })
    .then((data) => {
      session.login(data.access_token);
    });
}

export function me() {
  let params = {
    grant_type: 'password',
    client_id: '',
    client_secret: '',
    username,
    password
  };
  return api.get('api/v1/channel/me', params).then(data => {
    return data;
  });
}

export function forgot(username) {
  return api.post('api/v1/forgotpassword/request', { username });
}
