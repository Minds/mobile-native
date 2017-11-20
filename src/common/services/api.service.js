import { AsyncStorage } from 'react-native';
import { MINDS_URI } from '../../config/Config';

async function getAccessToken() {
  return await AsyncStorage.getItem('@Minds:access_token');
}

class ApiService {

  getParamsString(params) {
    urlParams = new URLSearchParams(Object.entries(params));
    return urlParams.toString();
  }

  async get(url, params={}) {
    const access_token = await getAccessToken();
    params.access_token = access_token;
    const paramsString = this.getParamsString(params);

    return new Promise((resolve, reject) => {
      fetch(MINDS_URI + url + '?' + paramsString)
        .then((resp) => {
          if (resp.status == 200) {
            resp.json()
              .then(data => {
                resolve(data);
              });
          } else {
            reject(resp.status);
          }
        })
        .catch(err => {
          console.log('error');
          reject(err);
        })
    });
  }
}

export default new ApiService();