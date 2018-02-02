import api from './../common/services/api.service';

/**
 * Wallet Service
 */
class WalletService {

  async getCount() {
    return (await api.get('api/v1/wallet/count')).count;
  }

  getHistory(offset) {
    return api.get('api/v1/wallet/transactions', { offset: offset, limit: 12 })
      .then((response) => {
        return {
          entities: response.transactions,
          offset: response['load-next'],
        };
      })
  }

  // Other currencies (money, usd)

  async getBalances() {
    return await api.get(`api/v1/blockchain/wallet/balance`);
  }

  /**
   * Join tokens & rewards
   * @param {string} number
   */
  join(number) {
    return api.post('api/v1/blockchain/rewards/verify', { number });
  }

  /**
   * Confirm join
   * @param {string} number
   * @param {string} code
   * @param {string} secret
   */
  confirm(number, code, secret) {
    return api.post('api/v1/blockchain/rewards/confirm', {
      number,
      code,
      secret
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

    return api.get(`api/v1/blockchain/transactions/ledger`, {
        from: Math.floor(+startDate / 1000),
        to: Math.floor(+endDate / 1000),
        offset: offset
      })
      .then((data) => {
        return {
          entities: data.transactions||[],
          offset: data['load-next'],
        }
      });
  }

  getContributions(startDate, endDate, offset) {
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);

    return api.get(`api/v1/blockchain/contributions`, {
        from: Math.floor(+startDate / 1000),
        to: Math.floor(+endDate / 1000),
        offset: offset
      })
      .then((data) => {
        console.log(data)
        return {
          entities: data.contributions || [],
          offset: data['load-next'],
        }
      });
  }
}

export default new WalletService();
