import api from './../common/services/api.service';

/**
 * Referrals Service
 */
class ReferralsService {

  async getReferrals(offset) {
    let response = await api.get('api/v2/referrals/',{ offset: offset, limit: 12 });
    return {
      entities: response.referrals,
      offset: response['load-next'],
    };
  }

  async pingReferral(guid) {
    let response = await api.put(`api/v2/referrals/${guid}`);
    return response.done;
  }
}

export default new ReferralsService();
