import api from './../../common/services/api.service';

export function vote(guid, direction) {
  return api.put('api/v1/votes/' + guid + '/' + direction)
    .then((data) => {
      return { data }
    })
    .catch(err => {
      console.log('error', err);
      throw "Oops, an error has occurred whilst voting.";
    })
}
