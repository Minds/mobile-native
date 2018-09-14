import api from './../common/services/api.service';
import BlockchainWireService from '../blockchain/services/BlockchainWireService';
import BlockchainTokenService from '../blockchain/services/BlockchainTokenService';
import BlockchainWalletService from '../blockchain/wallet/BlockchainWalletService';

/**
 * Wire Service
 */
class WireService {

  /**
   * Unlock an activity
   * @param {string} guid
   */
  unlock(guid) {
    return api.get(`api/v1/wire/threshold/${guid}`)
      .then((response) => {
        if (response.hasOwnProperty('activity')) {
          return response.activity;
        } else if (response.hasOwnProperty('entity')) {
          return response.entity;
        }
        return false;
      });
  }

  /**
   * Get overview
   * @param {string} guid
   */
  overview(guid) {
    return api.get(`api/v1/wire/sums/overview/${guid}?merchant=1`);
  }

  /**
   * Get user rewards
   * @param {string} guid
   */
  userRewards(guid) {
    return api.get(`api/v1/wire/rewards/${guid}/entity`);
  }

  /**
   * Get rewards
   * @param {string} guid
   */
  rewards(guid) {
    return api.get(`api/v1/wire/rewards/${guid}`)
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

    if (!payload) {
      return;
    }

    return await api.post(`api/v1/wire/${opts.guid}`, {
      payload,
      method: 'tokens',
      amount: opts.amount,
      recurring: !!opts.recurring
    }).then(result => {
      result.payload = payload;
      return result;
    });
  }

  /**
   * Get transaction payloads
   * @param {object} opts
   */
  async getTransactionPayloads(opts) {
    const payload = await BlockchainWalletService.selectCurrent(`Select the wallet you would like to use for this Wire.`, { signable: true, offchain: true, buyable: true, confirmTokenExchange: opts.amount });

    if (!payload || payload.cancelled) {
      return;
    }

    switch (payload.type) {
      case 'creditcard':
        return {
          method: payload.type,
          address: 'offchain',
          token: payload.token
        };

      case 'offchain':
        return {
          method: 'offchain',
          address: 'offchain'
        };

      case 'onchain':
        if (!opts.owner.eth_wallet) {
          throw new Error('User cannot receive OnChain tokens because they haven\'t setup an OnChain address. Please retry OffChain.');
        }

        if (opts.recurring) {
          await BlockchainTokenService.increaseApproval(
            (await BlockchainWireService.getContract()).options.address,
            opts.amount * 11,
            'We need you to pre-approve Minds Wire wallet for the recurring wire transactions.'
          );
        }

        return {
          method: payload.type,
          address: payload.wallet.address,
          receiver: opts.owner.eth_wallet,
          txHash: await BlockchainWireService.create(opts.owner.eth_wallet, opts.amount)
        };
    }

    throw new Error('Unknown type');
  }
}

export default new WireService();
