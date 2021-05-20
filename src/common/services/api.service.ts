import Cancelable from 'promise-cancelable';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { NativeModules } from 'react-native';

const LOGOUT_EXCEPTIONS = ['password/validate'];

import session from './session.service';
import {
  MINDS_API_URI,
  MINDS_CANARY,
  MINDS_STAGING,
  NETWORK_TIMEOUT,
  OAUTH_ENDPOINT,
} from '../../config/Config';

import { Version } from '../../config/Version';
import logService from './log.service';

import { observable, action } from 'mobx';
import { UserError } from '../UserError';
import i18n from './i18n.service';
import sessionService from './session.service';

export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  errorId?: string;
}

/**
 * Api Error
 */
export class ApiError extends Error {
  errId: string = '';
  headers: any = null;

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

const shouldLogout = (url: string) => {
  return !LOGOUT_EXCEPTIONS.some(e => url.includes(e));
};

/**
 * Api service
 */
export class ApiService {
  refreshPromise: null | Promise<any> = null;
  axios: AxiosInstance;
  @observable mustVerify = false;

  @action
  setMustVerify(value) {
    this.mustVerify = value;
  }

  constructor(axiosInstance = null) {
    this.axios =
      axiosInstance ||
      axios.create({
        baseURL: MINDS_API_URI,
      });

    this.axios.interceptors.request.use(config => {
      config.headers = this.buildHeaders(config.headers);
      config.timeout = NETWORK_TIMEOUT;
      return config;
    });

    this.axios.interceptors.response.use(
      response => {
        this.checkResponse(response);
        return response;
      },
      async error => {
        const { config: originalReq, response } = error;

        if (response) {
          // refresh token if possible and repeat the call
          if (
            response.status === 401 &&
            !originalReq._isRetry &&
            originalReq.url !== MINDS_API_URI + OAUTH_ENDPOINT
          ) {
            await this.refreshToken();
            originalReq._isRetry = true;
            return this.axios(originalReq);
          }

          // prompt the user if email verification is needed for this endpoint
          if (isApiForbidden(response) && response.data.must_verify) {
            this.setMustVerify(true);
            throw new ApiError(i18n.t('emailConfirm.confirm'));
          }

          this.checkResponse(response);
        }

        throw error;
      },
    );
  }

  /**
   * Refresh token (only one call at the time)
   */
  async refreshToken() {
    if (!this.refreshPromise) {
      this.refreshPromise = sessionService.refreshAuthToken();
    }
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  checkResponse<T extends ApiResponse>(response: AxiosResponse<T>): T {
    const data = response.data;

    // Failed on API side
    if (data && data.status && data.status !== 'success') {
      const msg = data && data.message ? data.message : 'Server error';
      const errId = data && data.errorId ? data.errorId : '';
      const apiError = new ApiError(msg);
      apiError.errId = errId;
      apiError.headers = response.headers;
      throw apiError;
    }
    if (response.status === 500) {
      throw new ApiError('Server error');
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
    return new Promise(success => {
      NativeModules.Networking.clearCookies(success);
    });
  }

  /**
   * Build headers
   */
  buildHeaders(customHeaders: any = {}) {
    const headers: any = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      'App-Version': Version.VERSION,
      ...customHeaders,
    };

    if (MINDS_STAGING) {
      headers.Cookie = 'staging=1';
    }
    if (MINDS_CANARY) {
      headers.Cookie = 'canary=1';
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
    if (process.env.JEST_WORKER_ID === undefined) {
      params.cb = Date.now(); //bust the cache every time
    }

    if (MINDS_STAGING) {
      params.staging = '1';
    }
    if (MINDS_CANARY) {
      params.canary = '1';
    }

    const paramsString = this.getParamsString(params);
    const sep = paramsString ? (url.indexOf('?') > -1 ? '&' : '?') : '';

    return `${url}${sep}${paramsString}`;
  }

  getParamsString(params) {
    return Object.keys(params)
      .map(k => {
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
    const response = await this.axios.get(this.buildUrl(url, params));

    return response.data;
  }

  /**
   * Api post
   * @param {string} url
   * @param {object} body
   */
  async post<T extends ApiResponse>(
    url: string,
    body: any = {},
    headers: any = {},
  ): Promise<T> {
    const response = await this.axios.post(this.buildUrl(url), body, {
      headers,
    });

    return response.data;
  }

  /**
   * Api put
   * @param {string} url
   * @param {object} body
   */
  async put<T extends ApiResponse>(url: string, body: any = {}): Promise<T> {
    const response = await this.axios.put(this.buildUrl(url), body);

    return response.data;
  }

  /**
   * Api delete
   * @param {string} url
   * @param {object} data
   */
  async delete<T extends ApiResponse>(
    url: string,
    data: any = {},
    headers: any = {},
  ): Promise<T> {
    const response = await this.axios.delete(this.buildUrl(url), {
      data,
      headers,
    });

    return response.data;
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
      onCancel(cb => {
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
    }).catch(error => {
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
      onCancel(cb => {
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
    }).catch(error => {
      if (error.name !== 'CancelationError') {
        logService.exception('[ApiService] upload', error);
        throw error;
      }
    });
  }
}

export default new ApiService();
