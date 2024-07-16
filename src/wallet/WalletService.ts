import { ApiResponse } from '~/common/services/ApiResponse';
import type { ApiService } from './../common/services/api.service';
import { ListFiltersType } from './v2/TransactionList/TransactionsListTypes';
import moment from 'moment';
export interface WalletJoinResponse extends ApiResponse {
  secret: string;
}

/**
 * Wallet Service
 */
export class WalletService {
  constructor(private api: ApiService) {}

  async getCount() {
    return (await this.api.get<{ count: number }>('api/v1/wallet/count')).count;
  }

  getHistory(offset) {
    return this.api
      .get<{
        transactions: Array<any>;
      }>('api/v1/wallet/transactions', { offset: offset, limit: 12 })
      .then(response => {
        return {
          entities: response.transactions,
          offset: response['load-next'],
        };
      });
  }

  /**
   * Get contributions overview
   */
  getContributionsOverview() {
    return this.api.get('api/v2/blockchain/contributions/overview');
  }

  // Other currencies (money, usd)

  async getBalances() {
    return await this.api.get(`api/v2/blockchain/wallet/balance`);
  }

  /**
   * Join tokens & rewards
   * @param {string} number
   * @param {boolean} retry
   */
  join(number: string, retry): Promise<WalletJoinResponse> {
    const params: any = { number };
    if (retry) {
      params.retry = 1;
    }
    return this.api.post('api/v2/blockchain/rewards/verify', params);
  }

  /**
   * Confirm join
   * @param {string} number
   * @param {string} code
   * @param {string} secret
   */
  confirm(number, code, secret) {
    return this.api.post('api/v2/blockchain/rewards/confirm', {
      number,
      code,
      secret,
    });
  }

  /**
   * Get rewards ledger
   * @param {date} startDate
   * @param {date} endDate
   * @param {string} offset
   */
  getTransactionsLedger(startDate, endDate, offset) {
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);

    return this.api
      .get<{
        transactions: Array<any>;
      }>(`api/v2/blockchain/transactions/ledger`, {
        from: Math.floor(+startDate / 1000),
        to: Math.floor(+endDate / 1000),
        offset: offset,
      })
      .then(data => {
        return {
          entities: data.transactions || [],
          offset: data['load-next'],
        };
      });
  }

  async getFilteredTransactionsLedger(filters: ListFiltersType, offset) {
    filters.dateRange.from.setHours(0, 0, 0);
    filters.dateRange.to.setHours(23, 59, 59);

    let opts = {
      from: 0,
      to: moment().unix(),
      contract:
        filters.transactionType === 'all' ? '' : filters.transactionType,
      offset,
    };

    if (!filters.dateRange.none) {
      opts.from = Math.floor(+filters.dateRange.from / 1000);
      opts.to = Math.floor(+filters.dateRange.to / 1000);
    }
    const data = await this.api.get<{
      transactions: Array<any>;
    }>('api/v2/blockchain/transactions/ledger', opts);
    return {
      entities: data.transactions || [],
      offset: data['load-next'],
    };
  }

  getContributions(startDate, endDate, offset) {
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);

    return this.api
      .get<{ contributions: Array<any> }>(`api/v2/blockchain/contributions`, {
        from: Math.floor(+startDate / 1000),
        to: Math.floor(+endDate / 1000),
        offset: offset,
      })
      .then(data => {
        return {
          entities: data.contributions || [],
          offset: data['load-next'],
        };
      });
  }
}
