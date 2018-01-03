const Web3 = require('web3');
import { BLOCKCHAIN_URI } from "../config/Config";

class Web3Service {
  web3;

  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(BLOCKCHAIN_URI)
    );
  }

  // Wallets

  createWallet() {
    const { address, privateKey } = this.web3.eth.accounts.create(/* TODO: Custom entropy */);
    return { address, privateKey };
  }

  getAddressFromPK(privateKey) {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
  }

  isPKAddress(address, privateKey) {
    return this.getAddressFromPK(privateKey).toLowerCase() === address.toLowerCase();
  }
}

export default new Web3Service();
