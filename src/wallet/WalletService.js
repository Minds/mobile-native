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

  async getMoneyBalance() {
    return (await api.get(`api/v1/monetization/revenue/overview`)).balance;
  }

  async getTokensBalance() {
    return (await api.get(`api/v1/blockchain/wallet/balance`)).wallet.balance;
  }

  async getRewardsBalance() {
    return (await api.get(`api/v1/blockchain/rewards/balance`)).balance;
  }
}

export default new WalletService();
