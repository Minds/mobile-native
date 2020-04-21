//@ts-nocheck
import api from './../common/services/api.service';
import { abort, isNetworkFail } from '../common/helpers/abortableFetch';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';

export default class BoostService {
  async getBoosts(offset, filter, peer_filter) {
    // abort previous call
    abort(this);

    try {
      const data = await api.get(
        'api/v2/boost/' + filter + '/' + peer_filter,
        {
          offset: offset,
          limit: 15,
        },
        this,
      );

      return {
        entities: data.boosts,
        offset: data['load-next'],
      };
    } catch (err) {
      if (!isNetworkFail(err)) {
        logService.exception('[BoostService]', err);
      }
      throw new Error(i18n.t('boosts.errorGet'));
    }
  }
}

export function revokeBoost(guid, filter) {
  return api.delete('api/v2/boost/' + filter + '/' + guid + '/revoke');
}

export function rejectBoost(guid) {
  return api.delete('api/v2/boost/peer/' + guid);
}

export function acceptBoost(guid) {
  return api.put('api/v2/boost/peer/' + guid);
}

export function getRates() {
  return api.get(`api/v2/boost/rates`);
}
