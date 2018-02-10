import api from './../common/services/api.service';

class BlockchainApiService {
  serverWalletAddressCache;

  async getWallet(refresh = false) {
    if (this.serverWalletAddressCache && !refresh) {
      return this.serverWalletAddressCache;
    }

    this.serverWalletAddressCache = void 0;

    try {
      let response = await api.get(`api/v2/blockchain/wallet/address`);

      if (response.wallet) {
        this.serverWalletAddressCache = response.wallet.address;
        return response.wallet.address;
      }
    } catch (e) {
      throw new Error('There was an issue getting your saved wallet info');
    }
  }

  async setWallet(address) {
    await api.post(`api/v2/blockchain/wallet`, { address });
    this.serverWalletAddressCache = address;
  }

  async getUSDRate() {
    try {
      return this.getRate('');
    } catch (e) {
      return null;
    }
  }

  async getRate(currency = '') {
    return (await api.get(`api/v2/blockchain/rate/${currency}`)).rate;
  }
}

export default new BlockchainApiService();
