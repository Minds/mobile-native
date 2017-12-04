import api from './../common/services/api.service';

/**
 * Wire Service
 */
class WireService {

  overview(guid) {
    return api.get('api/v1/wire/sums/overview/' + guid + '?merchant=1');
  }

  rewards(guid) {
    return api.get('api/v1/wire/rewards/' + guid )
      .then(rewards => {
        return (rewards.wire_rewards) ? rewards.wire_rewards.rewards: null;
      });
  }
}

export default new WireService();