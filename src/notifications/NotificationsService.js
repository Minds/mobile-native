import api from './../common/services/api.service';

export function getFeed(offset) {
  return api.get('api/v1/notifications/', { offset: offset, limit: 15 })
    .then((data) => {
      return {
        entities: data.notifications,
        offset: encodeURIComponent(data['load-next']),
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