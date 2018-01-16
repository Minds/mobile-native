import api from './../common/services/api.service';
import BlockchainWireService from '../blockchain/services/BlockchainWireService';
import BlockchainTokenService from '../blockchain/services/BlockchainTokenService';

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
   * @param {object} opts
   */
  async send(opts) {
    const payload = await this.getTransactionPayloads(opts);

    return await api.post(`api/v1/wire/${opts.guid}`, {
      payload,
      method: opts.method,
      amount: opts.amount,
      recurring: !!opts.recurring
    });
  }

  async getTransactionPayloads(opts) {
    switch (opts.method) {
      case "money":
       throw new Error('Not implemented');

      case "tokens":
        if (!opts.owner.eth_wallet) {
          throw new Error('User cannot receive tokens');
        }

        if (opts.recurring) {
          await BlockchainTokenService.increaseApproval(
            (await BlockchainWireService.getContract()).options.address,
            opts.amount * 11,
            'We need you to pre-approve Minds Wire wallet for the recurring wire transactions.'
          );

          await new Promise(r => setTimeout(r, 500)); // Modals have a "cooldown"
        }

        return {
          receiver: opts.owner.eth_wallet,
          txHash: await BlockchainWireService.create(opts.owner.eth_wallet, opts.amount)
        };

      case "points":
        return {};
    }

    throw new Error('Unknown method');
  }
}

export default new WireService();
