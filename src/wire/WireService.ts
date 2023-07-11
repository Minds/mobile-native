import api from '../common/services/api.service';
import i18n from '../common/services/i18n.service';
import BlockchainWireService from '../blockchain/v2/services/BlockchainWireService';

import type {
  WireRequest,
  PaymentMethod,
  TransactionPayload,
} from './WireTypes';
import { WCStore } from '../blockchain/v2/walletconnect/WalletConnectContext';

/**
 * Wire Service
 */
class WireService {
  /**
   * Unlock an activity
   * @param {string} guid
   */
  unlock(guid: string): Promise<any> {
    return api
      .get(`api/v1/wire/threshold/${guid}`)
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
  userRewards(guid: string): Promise<any> {
    return api.get(`api/v1/wire/rewards/${guid}/entity`);
  }

  /**
   * Get rewards
   * @param {string} guid
   */
  rewards(guid: string): Promise<any> {
    return api.get(`api/v1/wire/rewards/${guid}`).then((rewards: any): any => {
      rewards = rewards.wire_rewards ? rewards.wire_rewards.rewards : null;
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
  async send(opts: WireRequest, wc?: WCStore): Promise<any> {
    const payload = await this.getTransactionPayloads(opts, wc);

    if (!payload) {
      return;
    }

    return await api
      .post(`api/v2/wire/${opts.guid}`, {
        payload,
        method: payload.method,
        amount: opts.amount,
        recurring: !!opts.recurring,
      })
      .then((result: any): any => {
        console.log('result', result);
        result.payload = payload;
        return result;
      });
  }

  /**
   * Get transaction payloads
   * @param {object} opts
   */
  async getTransactionPayloads(
    opts: WireRequest,
    wc?: WCStore,
  ): Promise<TransactionPayload> {
    let type: PaymentMethod | null = null;
    switch (opts.currency) {
      case 'tokens':
        type = opts.offchain ? 'offchain' : 'onchain';
        break;
      case 'eth':
      case 'usd':
        type = opts.currency;
        break;
    }

    switch (type) {
      case 'offchain':
        return {
          method: 'offchain',
          address: 'offchain',
        };
      case 'onchain':
        if (!opts.owner.eth_wallet) {
          throw new Error(i18n.t('boosts.errorCantReceiveTokens'));
        }
        if (!wc) {
          throw new Error('A wallet connect store must be provided');
        }

        try {
          await wc?.connect();
        } catch (error) {
          console.log(error);
          // if the user cancel the connection or it fails we return null
          return null;
        }

        if (!wc.web3 || !wc?.address) {
          throw new Error('You must connect a wallet first');
        }

        const wireService = new BlockchainWireService(wc.web3, wc);

        return {
          method: type,
          address: wc.address,
          receiver: opts.owner.eth_wallet,
          txHash: await wireService.create(
            opts.owner.eth_wallet,
            opts.amount,
            wc.address,
          ),
        };

      case 'eth':
        if (!opts.owner.eth_wallet) {
          throw new Error(i18n.t('boosts.errorCantReceiveTokens'));
        }
        if (!wc) {
          throw new Error('A wallet connect store must be provided');
        }

        try {
          await wc?.connect();
        } catch (error) {
          console.log(error);
          // if the user cancel the connection or it fails we return null
          return null;
        }

        if (!wc.web3 || !wc?.address) {
          throw new Error('You must connect a wallet first');
        }

        const blockchainWireService = new BlockchainWireService(wc.web3, wc);

        return {
          method: type,
          address: wc.address,
          receiver: opts.owner.eth_wallet,
          txHash: await blockchainWireService.createEth(
            wc.address,
            opts.owner.eth_wallet,
            opts.amount,
          ),
        };

      case 'usd':
        return {
          method: type,
          paymentMethodId: opts.paymentMethodId,
        };
    }

    throw new Error('Unknown type');
  }
}

export default new WireService();
