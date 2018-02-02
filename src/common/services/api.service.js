import session from './session.service';
import { MINDS_URI, MINDS_URI_SETTINGS } from '../../config/Config';
import { btoa } from 'abab';

class ApiService {

  buildHeaders() {
    const basicAuth = MINDS_URI_SETTINGS && MINDS_URI_SETTINGS.basicAuth,
      accessToken = session.token,
      headers = {};

    if (basicAuth) {
      headers.Authorization = `Basic ${btoa(basicAuth)}`;
    } else if (accessToken) {
      // Send via header if basic auth is not enabled
      headers.Authorization = `Bearer ${accessToken.toString()}`;
    }

    return headers;
  }

  async buildParamsString(params) {
    const basicAuth = MINDS_URI_SETTINGS && MINDS_URI_SETTINGS.basicAuth,
      accessToken = session.token;

    if (accessToken && basicAuth) {
      // Send via GET only if basic auth is enabled
      params['access_token'] = accessToken.toString();
    }

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

  async get(url, params={}) {
    const paramsString = await this.buildParamsString(params);
    const headers = this.buildHeaders();

    return await new Promise((resolve, reject) => {
      fetch(MINDS_URI + url + paramsString, { headers })
        // throw if response status is not 200
        .then(resp => {
          if (!resp.ok) {
            throw resp;
          }
          return resp;
        })
        // parse json
        .then(response => response.json())
        // verify api call success
        .then(jsonResp => {
          if (jsonResp.status != 'success') {
            return reject(jsonResp);
          }
          return resolve(jsonResp)
        })
        // catch all errors
        .catch(err => {
          if (err.status && err.status == 401) {
            session.logout();
          }
          return reject(err);
        })
    });
  }

  async post(url, body={}) {
    const paramsString = await this.buildParamsString({});
    const headers = this.buildHeaders();

    return await new Promise((resolve, reject) => {
      fetch(MINDS_URI + url + paramsString, { method: 'POST', body: JSON.stringify(body), headers })
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
            session.logout();
          }
          return reject(err);
        })
    });
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
            session.logout();
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
            session.logout();
          }
          return reject(err);
        })
    });
  }

  async upload(url, file, data, progress) {
    const paramsString = await this.buildParamsString({});
    var formData = new FormData();
    formData.append('file', file);
    for (var key in data) {
      formData.append(key, data[key]);
    }
    const basicAuth = MINDS_URI_SETTINGS && MINDS_URI_SETTINGS.basicAuth;
    return new Promise((resolve, reject)=>{

      let xhr = new XMLHttpRequest();

      if (progress) {
        xhr.upload.addEventListener("progress", progress);
      }
      xhr.open('POST', MINDS_URI + url + paramsString);
      if (basicAuth) {
        xhr.setRequestHeader('Authorization', `Basic ${btoa(basicAuth)}`);
      }
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data;');

      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          let data = JSON.parse(xhr.responseText);
          if (data.status == 'error') 
            return reject(data);

          resolve(data);
        }
      };

      xhr.send(formData);
            /*.then(resp => {
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
            session.logout();
          }
          return reject(err);
        })*/
    });
  }
}

export default new ApiService();
