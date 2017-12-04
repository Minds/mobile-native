import { MINDS_URI } from '../config/Config';
import api from './../common/services/api.service';
import session from './../common/services/session.service';

export function login(username, password) {
  let params = {
    grant_type: 'password',
    client_id: '',
    cliemt_secret: '',
    'username': username,
    'password': password
  };
  return api.post('oauth2/token', params).then(data => {
    session.setAccessToken(data.access_token);
  });
}

export function me() {
  let params = {
    grant_type: 'password',
    client_id: '',
    cliemt_secret: '',
    'username': username,
    'password': password
  };
  return api.get('api/v1/channel/me', params).then(data => {
    return data;
  });
}
