
import { MINDS_URI } from '../config/Config';
import api from './../common/services/api.service';

export function register(username, email, password) {
  let params = {
    'email': email,
    'username': username,
    'password': password
  };

  return api.post('api/v1/register', params);
}
