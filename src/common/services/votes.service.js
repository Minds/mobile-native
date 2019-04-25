import api from './../../common/services/api.service';
import logService from './log.service';

export function vote(guid, direction) {
  return api.put('api/v1/votes/' + guid + '/' + direction)
    .then((data) => {
      return { data }
    })
    .catch(err => {
      logService.exception('[VotesService]', err);
      throw "Oops, an error has occurred whilst voting.";
    })
}
