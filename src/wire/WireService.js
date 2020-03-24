import api from './../common/services/api.service';
import i18n from '../common/services/i18n.service';
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
  unlock(guid: string): Promise<any> {
    return api.get(`api/v1/wire/threshold/${guid}`)
      .then((response: any): any => {
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
  overview(guid: string): Promise<any> {
    return api.get(`api/v1/wire/sums/overview/${guid}?merchant=1`);
  }

  /**
   * Get user rewards
   * @param {string} guid
   */
  userRewards(guid: string): Promise<any>{
    return api.get(`api/v1/wire/rewards/${guid}/entity`);
  }

  /**
   * Get rewards
   * @param {string} guid
   */
  rewards(guid: string): Promise<any>{
    return api.get(`api/v1/wire/rewards/${guid}`)
      .then((rewards: any): any=> {
        rewards = (rewards.wire_rewards) ? rewards.wire_rewards.rewards : null
        if (rewards) {
          // map types
          for (let type in rewards) {
            rewards[type] = rewards[type].map((reward): any => {
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
  async send(opts: Object): Promise<any> {
    const payload = await this.getTransactionPayloads(opts);

    if (!payload) {
      return;
    }

    return await api.post(`api/v2/wire/${opts.guid}`, {
      payload,
      method: payload.method,
      amount: opts.amount,
      recurring: !!opts.recurring
    }).then((result: any): any => {
      result.payload = payload;
      return result;
    });
  }

  /**
   * Get transaction payloads
   * @param {object} opts
   */
  async getTransactionPayloads(opts: Object): any {

    let payload: Object;

    switch (opts.currency) {
      case 'tokens':
      case 'eth':
        payload = await BlockchainWalletService.selectCurrent(
          i18n.t('wire.selectWalletMessage'),
          {
            signable: true,
            offchain: opts.currency === 'tokens',
            confirmTokenExchange: opts.amount,
            currency: opts.currency
          }
        );
      break;
      case 'usd':
        payload = {type: 'usd'};
      break;
    }

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
          throw new Error(i18n.t('boosts.errorCantReceiveTokens'));
        }

        if (opts.recurring) {
          await BlockchainTokenService.increaseApproval(
            (await BlockchainWireService.getContract()).options.address,
            opts.amount * 11,
            i18n.t('wire.preApproveMessage')
          );
        }

        return {
          method: payload.type,
          address: payload.wallet.address,
          receiver: opts.owner.eth_wallet,
          txHash: await BlockchainWireService.create(opts.owner.eth_wallet, opts.amount)
        };

      case 'eth':
        if (!opts.owner.eth_wallet) {
          throw new Error(i18n.t('boosts.errorCantReceiveTokens'));
        }

        return {
          method: payload.type,
          address: payload.wallet.address,
          receiver: opts.owner.eth_wallet,
          txHash: await BlockchainWireService.createEth(opts.owner.eth_wallet, opts.amount)
        };

      case 'usd':
        return {
          method: payload.type,
          paymentMethodId: opts.paymentMethodId
        }
    }

    throw new Error('Unknown type');
  }
}

export default new WireService();
