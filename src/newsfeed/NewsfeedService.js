import { MINDS_URI } from '../config/Config';

import {
  AsyncStorage
} from 'react-native';

async function getAccessToken() {
  return await AsyncStorage.getItem('@Minds:access_token');
}

async function get(offset) {
  var headers = new Headers();

  const access_token = await getAccessToken();
  
  return new Promise((resolve, reject) => {
    fetch(MINDS_URI + `api/v1/newsfeed/network/?access_token=${access_token}&limit=12&offset=${offset}`)
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

export function getFeed(offset) {
  return get(offset)
    .then((data) => {
      return {
        entities: data.activity,
        offset: data['load-next'],
      }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}