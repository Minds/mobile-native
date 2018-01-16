const Web3 = require('web3');

import { BLOCKCHAIN_URI } from "../../config/Config";

import MindsService from '../../common/services/minds.service';
import BlockchainApiService from '../BlockchainApiService';
import StorageService from '../../common/services/storage.service';

import BlockchainTransactionStore from '../transaction-modal/BlockchainTransactionStore';

const sign = require('ethjs-signer').sign;

class Web3Service {
  contractInstances = {};
  web3;
  currentWalletAddress;

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

  async getCurrentWalletAddress(force) {
    if (!this.currentWalletAddress || force) {
      this.currentWalletAddress = await BlockchainApiService.getWallet();
    }

    return this.currentWalletAddress;
  }

  // Wallet locks

  async unlockWallet(address) {
    if (!address) {
      throw new Error('Missing wallet address');
    }

    if (!this.web3.utils.isAddress(address)) {
      throw new Error('Invalid wallet address');
    }

    const privateKey = await StorageService.getItem(`${address.toLowerCase()}:pk`);

    if (!privateKey) {
      throw new Error('Cannot unlock wallet');
    }

    return privateKey;
  }

  // Contracts

  async getContract(contractId) {
    const settings = (await MindsService.getSettings()).blockchain;

    if (!this.contractInstances[contractId]) {
      this.contractInstances[contractId] = new this.web3.eth.Contract(settings[contractId].abi, settings[contractId].address);
    }

    return this.contractInstances[contractId];
  }

  async getTransactionOptions() {
    return {
      from: await this.getCurrentWalletAddress()
    }
  }

  // Contract methods

  async sendSignedContractMethod(method, message = '') {
    const toHex = this.web3.utils.toHex,
      baseOptions = await this.getTransactionOptions();

    const privateKey = await this.unlockWallet(baseOptions.from);
    await new Promise(r => setTimeout(r, 500)); // Modals have a "cooldown"

    let estimatedGas = 0;
    try {
      let latestBlock = await this.web3.eth.getBlock('latest');

      estimatedGas = await method.estimateGas({
        from: baseOptions.from,
        to: method._parent.options.address,
        gas: latestBlock.gasLimit
      });
    } catch (e) { }

    const sendOptions = await BlockchainTransactionStore.waitForApproval(method, message, baseOptions, Math.ceil(estimatedGas * 1.5));

    if (sendOptions) {
      const nonce = await this.web3.eth.getTransactionCount(sendOptions.from, 'pending');

      const tx = {
        nonce,
        from: sendOptions.from,
        to: method._parent.options.address,
        data: method.encodeABI(),
        value: toHex(0),
        gas: toHex(parseInt(sendOptions.gasLimit, 10)),
        gasPrice: toHex(this.web3.utils.toWei(`${sendOptions.gasPrice}`, 'gwei')),
      }, signedTx = sign(tx, privateKey);

      return await this.web3.eth.sendSignedTransaction(signedTx);
    } else {
      throw new Error('User cancelled');
    }
  }
}

export default new Web3Service();
