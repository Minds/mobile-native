import api from './../../common/services/api.service';
import logService from './log.service';
import i18n from './i18n.service';
import { UserError } from '../UserError';

export function vote(guid, direction, data) {
  return api.put('api/v1/votes/' + guid + '/' + direction, data)
    .then((data) => {
      return { data }
    })
    .catch(err => {
      logService.exception('[VotesService]', err);
      throw new UserError(i18n.t('errorMessage'));
    })
}
