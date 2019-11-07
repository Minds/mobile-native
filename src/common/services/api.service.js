import Cancelable from 'promise-cancelable';
import { NativeModules } from 'react-native';

import session from './session.service';
import { MINDS_API_URI, MINDS_URI_SETTINGS, NETWORK_TIMEOUT } from '../../config/Config';

import abortableFetch from '../helpers/abortableFetch';
import { Version } from '../../config/Version';
import logService from './log.service';

/**
 * Api Error
 */
export class ApiError extends Error {
  constructor(...args) {
    super(...args);
  }
}

export const isApiError = function(err) {
  return err instanceof ApiError;
};

/**
 * Api service
 */
class ApiService {
  /**
   * Clear cookies
   */
  clearCookies() {
    return new Promise(success => {
      NativeModules.Networking.clearCookies(success);
    });
  }

  /**
   * Build headers
   */
  buildHeaders() {
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'App-Version': Version.VERSION
    };

    if (session.token) {
      headers.Authorization = 'Bearer ' + session.token;
    }

    return headers;
  }

  /**
   * Build url
   * @param {string} url
   * @param {any} params
   */
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
   * Throw an error
   * @param {any} err
   * @param {string} url
   */
  _throwError(err, url) {
    if (err instanceof Error) {
      throw err;
    }
    const error = new ApiError(err.message || err.responseText || `Request error on: ${url}`);
    if (err.status) {
      error.status = err.status;
    }
    throw error;
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
      const response = await abortableFetch(MINDS_API_URI + this.buildUrl(url, params), { headers, timeout: NETWORK_TIMEOUT },  tag);

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
        if (refreshed) {
          return await this.get(url, params, tag);
        }
        session.logout();
      }
      this._throwError(err, url);
    }
  }

  async post(url, body={}) {
    const headers = this.buildHeaders();

    try {
      let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), { method: 'POST', body: JSON.stringify(body), headers, timeout: NETWORK_TIMEOUT });

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
        if (refreshed) {
          return await this.post(url, body);
        }
        logService.log('[ApiService] Token refresh failed: logout');
        session.logout();
      }
      this._throwError(err, url);
    }
  }

  async put(url, body={}) {
    const headers = this.buildHeaders();

    try {
      let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), { method: 'PUT', body: JSON.stringify(body), headers, timeout: NETWORK_TIMEOUT });

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
        if (refreshed) {
          return await this.put(url, body);
        }
        logService.log('[ApiService] Token refresh failed: logout');
        session.logout();
      }
      this._throwError(err, url);
    }
  }

  /**
   * Upload file to s3, differences with generic upload are headers and formData (wich is not necessary)
   * @param {any} lease
   * @param {any} file
   * @param {function} progress
   */
  uploadToS3(lease, file, progress) {

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
      const url = lease.presigned_url;
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.onload = () => {
        if (xhr.status == 200) {
          resolve(true);
        } else {
          reject('Ooops: upload error');
        }
      };
      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      }

      xhr.send(file);
    })
    .catch( error => {
      if (error.name !== 'CancelationError') {
        logService.exception('[ApiService] upload', error);
        throw error;
      }
    });
  }

  async delete(url, body={}) {
    const headers = this.buildHeaders();

    try {
      let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), { method: 'DELETE', body: JSON.stringify(body), headers, timeout: NETWORK_TIMEOUT });

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
        if (refreshed) {
          return await this.delete(url, body);
        }
        logService.log('[ApiService] Token refresh failed: logout');
        session.logout();
      }
      this._throwError(err, url);
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
