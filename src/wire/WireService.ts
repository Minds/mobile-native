import type { ApiService } from '~/common/services/api.service';

import type {
  WireRequest,
  PaymentMethod,
  TransactionPayload,
} from './WireTypes';

/**
 * Wire Service
 */
export class WireService {
  constructor(private api: ApiService) {}
  /**
   * Unlock an activity
   * @param {string} guid
   */
  unlock(guid: string): Promise<any> {
    return this.api
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
    return this.api.get(`api/v1/wire/sums/overview/${guid}?merchant=1`);
  }

  /**
   * Get user rewards
   * @param {string} guid
   */
  userRewards(guid: string): Promise<any> {
    return this.api.get(`api/v1/wire/rewards/${guid}/entity`);
  }

  /**
   * Get rewards
   * @param {string} guid
   */
  rewards(guid: string): Promise<any> {
    return this.api
      .get(`api/v1/wire/rewards/${guid}`)
      .then((rewards: any): any => {
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
  async send(opts: WireRequest): Promise<any> {
    const payload = await this.getTransactionPayloads(opts);

    if (!payload) {
      return;
    }

    return await this.api
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
  async getTransactionPayloads(opts: WireRequest): Promise<TransactionPayload> {
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
        throw new Error('Onchain is not supported on mobile');

      case 'eth':
        throw new Error('Onchain is not supported on mobile');

      case 'usd':
        return {
          method: type,
          paymentMethodId: opts.paymentMethodId,
        };
    }

    throw new Error('Unknown type');
  }
}
