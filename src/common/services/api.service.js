import Cancelable from 'promise-cancelable';

import session from './session.service';
import { MINDS_API_URI, MINDS_URI_SETTINGS } from '../../config/Config';
import { btoa } from 'abab';

import abortableFetch from '../helpers/abortableFetch';
import { Version } from '../../config/Version';
import logService from './log.service';

/**
 * Api service
 */
class ApiService {

  buildHeaders() {
    const basicAuth = MINDS_URI_SETTINGS && MINDS_URI_SETTINGS.basicAuth,
      accessToken = session.token,
      headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'App-Version': Version.VERSION
      };

      if (session.token) {
        headers.Authorization = 'Bearer ' + session.token;
      }

    return headers;
  }

  buildUrl(url, params = {}) {
    if (!params) {
      params = {};
    }

    params['cb'] = Date.now(); //bust the cache every time

    const paramsString = this.getParamsString(params);
    const sep = url.indexOf('?') > -1 ? '&' : '?';

    return `${url}${sep}${paramsString}`
  }

  getParamsString(params) {
    return Object.keys(params).map(k => {
      return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    }).join('&');
  }

  /**
   * Api get with abort support
   * @param {string} url
   * @param {object} params
   * @param {mixed} tag
   */
  async get(url, params = {}, tag) {
    const headers = this.buildHeaders();
    try {
      const response = await abortableFetch(MINDS_API_URI + this.buildUrl(url, params), { headers },  tag);

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
        const refreshed = await session.badAuthorization(); //not actually a logout
        if (refreshed) return await this.get(url, params, tag);
        session.logout();
      }
      throw err;
    }
  }

  async post(url, body={}) {
    const headers = this.buildHeaders();

    try {
      let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), { method: 'POST', body: JSON.stringify(body), headers });

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
    } catch(err) {
      if (err.status && err.status == 401) {
        const refreshed = await session.badAuthorization(); //not actually a logout
        if (refreshed) return await this.post(url, body);
        logService.log('[ApiService] Token refresh failed: logout');
        session.logout();
      }
      throw err;
    }
  }

  async put(url, body={}) {
    const headers = this.buildHeaders();

    try {
      let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), { method: 'PUT', body: JSON.stringify(body), headers });

      if (!response.ok) {
        throw response;
      }

      // Convert from JSON
      const data = await response.json();

      // Failed on API side
      if (data.status === 'error') {
        throw data;
      }
      return data;
    } catch(err) {
      if (err.status && err.status == 401) {
        const refreshed = await session.badAuthorization(); //not actually a logout
        if (refreshed) return await this.post(url, body);
        logService.log('[ApiService] Token refresh failed: logout');
        session.logout();
      }
      throw err;
    }
  }

  async delete(url, body={}) {
    const headers = this.buildHeaders();

    try {
      let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), { method: 'DELETE', body: JSON.stringify(body), headers });

      if (!response.ok) {
        throw response;
      }

      // Convert from JSON
      const data = await response.json();

      // Failed on API side
      if (data.status === 'error') {
        throw data;
      }
      return data;
    } catch(err) {
      if (err.status && err.status == 401) {
        const refreshed = await session.badAuthorization(); //not actually a logout
        if (refreshed) return await this.post(url, body);
        logService.log('[ApiService] Token refresh failed: logout');
        session.logout();
      }
      throw err;
    }
  }

  upload(url, file, data=null, progress) {
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
      xhr.open('POST', MINDS_API_URI + this.buildUrl(url));
      xhr.setRequestHeader('Authorization', `Bearer ${session.token}`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
      xhr.onload = () => {
        if (xhr.status == 200) {
          let data = {'status': null}
          try {
            data = JSON.parse(xhr.responseText);
          } catch(e) {
            data.status = 'error'
          }
          if (data.status == 'error')
            return reject(data);

          resolve(data);
        } else {
          reject('Ooops: upload error');
        }
      };
      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      }

      xhr.send(formData);
    })
    .catch( error => {
      if (error.name !== 'CancelationError') {
        logService.exception('[ApiService] upload', error);
        throw error;
      }
    });
  }
}

export default new ApiService();
