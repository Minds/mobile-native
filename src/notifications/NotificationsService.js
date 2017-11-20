import apiService from './../common/services/api.service';

export function getFeed(offset) {
  return apiService.get('api/v1/notifications/', { offset: offset, limit: 15 })
    .then((data) => {
      return {
        entities: data.notifications,
        offset: encodeURIComponent(data['load-next']),
      }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}