import api from './../common/services/api.service';

export function getFeed(offset, filter) {
  return api.get('api/v1/notifications/' + filter, { offset: offset, limit: 15 })
    .then((data) => {
      return {
        entities: data.notifications,
        offset: data['load-next'],
      }
    })
    .catch(err => {
      console.log('error', err);
      throw "Ooops";
    })
}

export function getCount() {
  return api.get('api/v1/notifications/count');
}