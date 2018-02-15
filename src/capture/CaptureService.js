import { Platform } from 'react-native';

import api from './../common/services/api.service';

export function post(post) {
  return api.post('api/v1/newsfeed', post)
    .then((data) => {
      return {
        entity: data.activity,
      }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}