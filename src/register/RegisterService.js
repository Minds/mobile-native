
import { MINDS_URI } from '../config/Config';

import session  from './../common/services/session.service';

async function _register(username, email, password) {
  var headers = new Headers();

  headers.append('Content-Type', 'application/json'); // This one sends body
  let params = {
    method: 'post',
    credentials: "include",
    headers: headers,
    body: JSON.stringify({
      'email': email,
      'username': username,
      'password': password
    }),
  };

  return new Promise((resolve, reject) => {
    fetch(MINDS_URI + 'api/v1/register', params)
      .then((resp) => {
        if (resp.status == 200) {
          resp.json().then(data => {
            if (data.status == "error") {
              reject(data.message);
            } else {
              resolve(data);
            }
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

export function register(username, email, password) {
  return _register(username, email, password)
    .then((data) => {
      return true;
    })
    .catch(err => {
      throw err;
    })
}