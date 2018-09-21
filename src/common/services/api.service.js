import Cancelable from 'promise-cancelable';

import session from './session.service';
import { MINDS_URI, MINDS_URI_SETTINGS } from '../../config/Config';
import { btoa } from 'abab';


/**
 * Api service
 */
class ApiService {

  buildHeaders() {
    const basicAuth = MINDS_URI_SETTINGS && MINDS_URI_SETTINGS.basicAuth,
      accessToken = session.token,
      headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      };

      if (session.token) {
        headers.Authorization = 'Bearer ' + session.token;
      }

    return headers;
  }

  buildParamsString(params) {
    const basicAuth = MINDS_URI_SETTINGS && MINDS_URI_SETTINGS.basicAuth,
      accessToken = session.token;

    params['cb'] = Date.now(); //bust the cache every time

    const paramsString = this.getParamsString(params);

    if (paramsString) {
      return `?${paramsString}`;
    }

    return '';
  }

  getParamsString(params) {
    return Object.keys(params).map(k => {
      return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    }).join('&');
  }

  // Legacy (please, refactor!)

  async get(url, params={}, signal=null) {
    const paramsString = this.buildParamsString(params);
    const headers = this.buildHeaders();

      try {
        let response = await fetch(MINDS_URI + url + paramsString, { headers, signal });

        // Bad response
        if (!response.ok) {
          throw response;
        }

        // Convert from JSON
        const data = await response.json();

        // Failed on API side
        if (data.status != 'success') {
          throw data;
        }
        return data;
      } catch (err) {
        // Bad authorization
        if (err.status && err.status == 401) {
          await session.badAuthorization(); //not actually a logout
        }
        throw err;
      }
  }

 async post(url, body={}) {
    const paramsString = this.buildParamsString({});
    const headers = this.buildHeaders();

    try {
      let response = await fetch(MINDS_URI + url + paramsString, { method: 'POST', body: JSON.stringify(body), headers });

      if (!response.ok) {
        throw response;
      }

      // Convert from JSON
      const data = await response.json();

      console.log(data);

      // Failed on API side
      if (data.status != 'success') {
        throw data;
      }
      return data;
    } catch(err) {
      if (err.status && err.status == 401) {
        await session.badAuthorization();
      }
      throw err;
    }
  }

  async put(url, body={}) {
    const paramsString = await this.buildParamsString({});
    const headers = this.buildHeaders();

    return await new Promise((resolve, reject) => {
      fetch(MINDS_URI + url + paramsString, { method: 'PUT', body: JSON.stringify(body), headers })
        .then(resp => {
          if (!resp.ok) {
            throw resp;
          }
          return resp;
        })
        .then(response => response.json())
        .then(jsonResp => {
          if (jsonResp.status === 'error') {
            return reject(jsonResp);
          }
          return resolve(jsonResp)
        })
        .catch(err => {
          if (err.status && err.status == 401) {
            session.badAuthorization();
          }
          return reject(err);
        })
    });
  }

  async delete(url, body={}) {
    const paramsString = await this.buildParamsString({});
    const headers = this.buildHeaders();

    return await new Promise((resolve, reject) => {
      fetch(MINDS_URI + url + paramsString, { method: 'DELETE', body: JSON.stringify(body), headers })
        .then(resp => {
          if (!resp.ok) {
            throw resp;
          }
          return resp;
        })
        .then(response => response.json())
        .then(jsonResp => {
          if (jsonResp.status === 'error') {
            return reject(jsonResp);
          }
          return resolve(jsonResp)
        })
        .catch(err => {
          if (err.status && err.status == 401) {
            session.badAuthorization();
          }
          return reject(err);
        })
    });
  }

  upload(url, file, data=null, progress) {
    const paramsString = this.buildParamsString({});
    var formData = new FormData();
    formData.append('file', file);
    for (var key in data) {
      formData.append(key, data[key]);
    }

    return new Cancelable((resolve, reject, onCancel) => {

      let xhr = new XMLHttpRequest();

      // handle cancel
      onCancel((cb) => {
        xhr.abort();
        cb();
      });

      if (progress) {
        xhr.upload.addEventListener("progress", progress);
      }
      xhr.open('POST', MINDS_URI + url + paramsString);
      // fix XSRF
      // xhr.setRequestHeader('Authorization', `Bearer ${session.token}`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
      xhr.onload = () => {
        if (xhr.status == 200) {
          let data = JSON.parse(xhr.responseText);
          if (data.status == 'error')
            return reject(data);

          resolve(data);
        } else {
          reject('Ooops: upload error');
        }
      };

      xhr.send(formData);
    })
    .catch( error => {
      console.log(error)
      if (error.name !== 'CancelationError') {
        throw error;
      }
    });
  }
}

export default new ApiService();
