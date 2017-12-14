import api from './../common/services/api.service';

/**
 * Wire Service
 */
class WireService {

  overview(guid) {
    return api.get('api/v1/wire/sums/overview/' + guid + '?merchant=1');
  }

  userRewards(guid) {
    return api.get(`api/v1/wire/rewards/${guid}/entity`);
  }

  rewards(guid) {
    return api.get('api/v1/wire/rewards/' + guid )
      .then(rewards => {
        rewards = (rewards.wire_rewards) ? rewards.wire_rewards.rewards : null
        if (rewards) {
          // map types
          for (let type in rewards) {
            rewards[type] = rewards[type].map((reward) => {
              reward.type = type;
              return reward;
            });
          }
        }
        return rewards;
      });
  }

  /**
   * Send wire
   * @param {string} method
   * @param {numneric} amount
   * @param {string} guid
   * @param {boolean} recurring
   */
  send(method, amount, guid, recurring=false) {
    return this.getTransactionPayloads(method)
      .then(payload => {
        return api.post(`api/v1/wire/${guid}`, {
          payload,
          method,
          amount,
          recurring
        });
      });
  }

  getTransactionPayloads(method) {
    switch (method) {
      case "money":
       return Promise.reject({ message: 'Not implemented' });
      case "mindscoin":
        return Promise.reject({ message: 'Not implemented' });

      case "points":
        return Promise.resolve({});
    }

    return Promise.reject({ message: 'Unknown method' });
  }
}

export default new WireService();