import { Platform } from 'react-native';

import api from '../common/services/api.service';

import { getSingle } from '../newsfeed/NewsfeedService'


export function post(post) {
  return api.post('api/v1/newsfeed', post)
    .then((data) => {
      return {
        entity: data.activity,
      }
    });
}

export async function remind(guid, post) {
  const data = await api.post('api/v2/newsfeed/remind/' + guid , post)

  let resp = {activity: null};
  if (data.guid) {
    resp = await getSingle(data.guid);
  }
  return { entity: resp.activity };
}