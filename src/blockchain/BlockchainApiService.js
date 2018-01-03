import api from './../common/services/api.service';

class BlockchainApiService {
  serverWalletAddressCache;

  async getWallet(refresh = false) {
    if (this.serverWalletAddressCache && !refresh) {
      return this.serverWalletAddressCache;
    }

    this.serverWalletAddressCache = void 0;

    try {
      let response = await api.get(`api/v1/blockchain/wallet/address`);

      if (response.wallet) {
        this.serverWalletAddressCache = response.wallet.address;
        return response.wallet.address;
      }
    } catch (e) {
      throw new Error('There was an issue getting your saved wallet info');
    }
  }

  async setWallet(address) {
    await api.post(`api/v1/blockchain/wallet`, { address });
    this.serverWalletAddressCache = address;
  }
}

export default new BlockchainApiService();
