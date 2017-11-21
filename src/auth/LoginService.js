import { MINDS_URI } from '../config/Config';

import session  from './../common/services/session.service';

async function _login(username, password) {
  var headers = new Headers();

  headers.append('Content-Type', 'application/json'); // This one sends body
  let params = {
    method: 'post',
    credentials: "include",
    headers: headers,
    body: JSON.stringify({
      grant_type: 'password',
      client_id: '',
      cliemt_secret: '',
      'username': username,
      'password': password
    }),
  };

  return new Promise((resolve, reject) => {
    fetch(MINDS_URI + 'oauth2/token', params)
      .then((resp) => {
        if (resp.status == 200) {
          resp.json().then(data => {
            resolve(data);
          });
        } else {
          reject(resp.status);
        }
      })
      .catch(err => {
        reject(err);
      })
  });
}

export function login(username, password) {
  return _login(username, password)
    .then((data) => {
      session.setAccessToken(data.access_token);
      return true;
    })
    .catch(err => {
      throw "Ooops";
    })
}