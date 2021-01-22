import Cancelable from 'promise-cancelable';
import { NativeModules } from 'react-native';

import session from './session.service';
import {
  MINDS_API_URI,
  MINDS_STAGING,
  NETWORK_TIMEOUT,
} from '../../config/Config';

import abortableFetch, { abort } from '../helpers/abortableFetch';
import { Version } from '../../config/Version';
import logService from './log.service';

import * as Sentry from '@sentry/react-native';

import { observable, action } from 'mobx';
import { UserError } from '../UserError';
import i18n from './i18n.service';

export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
}

/**
 * Api Error
 */
export class ApiError extends Error {
  constructor(...args) {
    super(...args);
  }
}

export const isApiError = function (err) {
  return err instanceof ApiError;
};

export const isApiForbidden = function (err) {
  return err.status === 403;
};

/**
 * Api service
 */
class ApiService {
  @observable mustVerify = false;

  @action
  setMustVerify(value) {
    this.mustVerify = value;
  }

  async parseResponse<T extends ApiResponse>(response, url): Promise<T> {
    // check status
    if (response.status) {
      if (response.status === 401) {
        session.logout();
        throw new UserError('Session lost');
      }
    }

    let data, text;

    try {
      // Convert from JSON
      text = await response.text();
      data = JSON.parse(text);
    } catch (err) {
      if (response.ok && !__DEV__) {
        if (response.bodyUsed) {
          Sentry.captureMessage(`Server Error: ${url}\n${text}`);
        } else {
          Sentry.captureMessage(
            `Server Error: ${response.url}, STATUS: ${response.status}\n${text}`,
          );
        }
      } else {
        console.log('FAILED API CALL:', url, text);
      }
      throw new ApiError(i18n.t('errorMessage'));
    }

    if (isApiForbidden(response) && data.must_verify) {
      this.setMustVerify(true);
      throw new ApiError(i18n.t('emailConfirm.confirm'));
    }

    // Failed on API side
    if (data && data.status && data.status !== 'success') {
      const msg = data && data.message ? data.message : 'Server error';
      throw new ApiError(msg);
    }

    return data;
  }

  /**
   * Abort the calls attached to the tag
   * @param tag
   */
  abort(tag: any) {
    abort(tag);
  }

  /**
   * Clear cookies
   */
  clearCookies() {
    return new Promise((success) => {
      NativeModules.Networking.clearCookies(success);
    });
  }

  /**
   * Build headers
   */
  buildHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      'App-Version': Version.VERSION,
    };

    if (MINDS_STAGING) {
      headers.Cookie = 'staging=1';
    }

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
  buildUrl(url, params: any = {}) {
    if (!params) {
      params = {};
    }

    params.cb = Date.now(); //bust the cache every time

    if (MINDS_STAGING) {
      params.staging = '1';
    }

    const paramsString = this.getParamsString(params);
    const sep = url.indexOf('?') > -1 ? '&' : '?';

    return `${url}${sep}${paramsString}`;
  }

  getParamsString(params) {
    return Object.keys(params)
      .map((k) => {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      })
      .join('&');
  }

  /**
   * Api get with abort support
   * @param {string} url
   * @param {object} params
   * @param {mixed} tag
   */
  async get<T extends ApiResponse>(
    url: string,
    params: object = {},
    tag: any = null,
  ): Promise<T> {
    // build headers
    const headers = this.buildHeaders();

    const response = await abortableFetch(
      MINDS_API_URI + this.buildUrl(url, params),
      { headers, timeout: NETWORK_TIMEOUT },
      tag,
    );

    return await this.parseResponse<T>(response, url);
  }

  /**
   * Api post
   * @param {string} url
   * @param {object} body
   */
  async post<T extends ApiResponse>(url: string, body: any = {}): Promise<T> {
    const headers = this.buildHeaders();

    let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
      timeout: NETWORK_TIMEOUT,
    });

    return await this.parseResponse<T>(response, url);
  }

  /**
   * Api put
   * @param {string} url
   * @param {object} body
   */
  async put<T extends ApiResponse>(url: string, body: any = {}): Promise<T> {
    const headers = this.buildHeaders();

    let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
      timeout: NETWORK_TIMEOUT,
    });

    return await this.parseResponse<T>(response, url);
  }

  /**
   * Api delete
   * @param {string} url
   * @param {object} body
   */
  async delete<T extends ApiResponse>(url: string, body: any = {}): Promise<T> {
    const headers = this.buildHeaders();

    let response = await abortableFetch(MINDS_API_URI + this.buildUrl(url), {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers,
      timeout: NETWORK_TIMEOUT,
    });

    return await this.parseResponse<T>(response, url);
  }

  /**
   * Upload file to s3, differences with generic upload are headers and formData (wich is not necessary)
   * @param {any} lease
   * @param {any} file
   * @param {function} progress
   */
  uploadToS3(
    lease: { presigned_url: string },
    file: any,
    progress: (event: Event) => any,
  ) {
    return new Cancelable((resolve, reject, onCancel) => {
      let xhr = new XMLHttpRequest();

      // handle cancel
      onCancel((cb) => {
        xhr.abort();
        cb();
      });

      if (progress) {
        xhr.upload.addEventListener('progress', progress);
      }
      const url = lease.presigned_url;
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(true);
        } else {
          reject('Ooops: upload error');
        }
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.send(file);
    }).catch((error) => {
      if (error.name !== 'CancelationError') {
        logService.exception('[ApiService] upload', error);
        throw error;
      }
    });
  }

  /**
   * Upload file
   * @param {string} url
   * @param {object} file
   * @param {object} data
   * @param {Function} progress
   */
  upload(
    url: string,
    file: any,
    data: any | null = null,
    progress: (event: Event) => any,
  ) {
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
        xhr.upload.addEventListener('progress', progress);
      }
      xhr.open('POST', MINDS_API_URI + this.buildUrl(url));
      xhr.setRequestHeader('Authorization', `Bearer ${session.token}`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
      xhr.setRequestHeader('App-Version', Version.VERSION);
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 403) {
          let response: ApiResponse;
          try {
            response = JSON.parse(xhr.responseText);
          } catch (e) {
            response = {
              status: 'error',
              message: 'Error parsing server response',
            };
          }
          if (response.status === 'error' || xhr.status === 403) {
            return reject(response);
          }
          resolve(response);
        } else {
          reject(new UserError('Upload failed'));
        }
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.send(formData);
    }).catch((error) => {
      if (error.name !== 'CancelationError') {
        logService.exception('[ApiService] upload', error);
        throw error;
      }
    });
  }
}

export default new ApiService();
