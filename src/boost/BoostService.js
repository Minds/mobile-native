import api from './../common/services/api.service';

export function getBoosts(offset, filter) {
  return api.get('api/v1/boost/' + filter, { offset: offset, limit: 15 })
    .then((data) => {
      return {
        entities: data.boosts,
        offset: data['load-next'],
      }
    })
    .catch(err => {
      console.log('error', err);
      throw "Ooops";
    })
}
