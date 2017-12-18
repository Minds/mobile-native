import api from './../../common/services/api.service';

export function thumbActivity(guid, direction) {
  return api.put('api/v1/votes/' + guid + '/' + direction)
    .then((data) => {
      return { data }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}