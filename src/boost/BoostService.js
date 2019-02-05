import api from './../common/services/api.service';
import { abort } from '../common/helpers/abortableFetch';

export default class BoostService {

  controllers = {
    getBoosts: null
  };

  async getBoosts(offset, filter, peer_filter) {

    // abort previous call
    abort(this);

    try {
      const data = await api.get('api/v2/boost/' + filter + '/' + peer_filter,
        {
          offset: offset,
          limit: 15
        },
        this.controllers._getBoosts.signal
      );

      return {
        entities: data.boosts,
        offset: data['load-next'],
      }

    } catch (err) {
      console.log('error', err);
      throw "Ooops";
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
