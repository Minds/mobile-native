import session from './session.service';
import { MINDS_URI } from '../../config/Config';

class ApiService {

  getParamsString(params) {
    urlParams = new URLSearchParams(Object.entries(params));
    return urlParams.toString();
  }

  async get(url, params={}) {
    const access_token = await session.getAccessToken();
    params.access_token = access_token;
    const paramsString = this.getParamsString(params);

    return new Promise((resolve, reject) => {
      fetch(MINDS_URI + url + '?' + paramsString)
        // throw if response status is not 200
        .then(resp => {
          if (!resp.ok) {
            throw resp;
          }
          return resp;
        })
        // parse json
        .then(response => response.json())
        // resolve promise
        .then(jsonResp => {return resolve(jsonResp)})
        // catch all errors
        .catch(err => {
          if (err.status && err.status == 401) {
            session.clear();
          }
          return reject(err);
        })
    });
  }
}

export default new ApiService();