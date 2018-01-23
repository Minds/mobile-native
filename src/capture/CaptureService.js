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

export async function uploadAttachment(url, file, progress) {
  try {
    let data = await api.upload(url, file, null, progress);
    return data;
  } catch (e) {
      throw {
        error: e,
        url: url,
        file: file
      };
      throw "Ooops";
  }
}