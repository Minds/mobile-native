import api from './../common/services/api.service';

/**
 * Wallet Service
 */
class WalletService {

  getCount() {
    return api.get('api/v1/wallet/count')
      .then((response) => {
        return response.count;
      })
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
}

export default new WalletService();