import api from './../common/services/api.service';
import BlockchainWireService from '../blockchain/services/BlockchainWireService';
import BlockchainTokenService from '../blockchain/services/BlockchainTokenService';
import BlockchainWalletService from '../blockchain/wallet/BlockchainWalletService';

/**
 * Wire Service
 */
class WireService {

  unlock(guid) {
    return api.get('api/v1/wire/threshold/' + guid)
      .then((response) => {
        if (response.hasOwnProperty('activity')) {
          return response.activity;
        } else if (response.hasOwnProperty('entity')) {
          return response.entity;
        }
        return false;
      });
  }

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
    const methodOrAddress = await BlockchainWalletService.selectCurrent(`Select the wallet you would like to use for this Wire.`, { signable: true, offchain: false, buyable: true });

    switch (methodOrAddress) {
      case 'creditcard':
        throw new Error('Not implemented');

      case 'offchain':
        throw new Error('Cannot send OffChain tokens');

      default:
        if (!opts.owner.eth_wallet) {
          throw new Error('User cannot receive tokens');
        }

        if (opts.recurring) {
          await BlockchainTokenService.increaseApproval(
            (await BlockchainWireService.getContract()).options.address,
            opts.amount * 11,
            'We need you to pre-approve Minds Wire wallet for the recurring wire transactions.'
          );
        }

        return {
          receiver: opts.owner.eth_wallet,
          txHash: await BlockchainWireService.create(opts.owner.eth_wallet, opts.amount)
        };
    }

    throw new Error('Unknown method');
  }
}

export default new WireService();
