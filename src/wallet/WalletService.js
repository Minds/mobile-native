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

}

export default new WalletService();