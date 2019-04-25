import BlockchainWalletService from '../wallet/BlockchainWalletService';

const Web3 = require('web3');

import { BLOCKCHAIN_URI } from "../../config/Config";

import MindsService from '../../common/services/minds.service';
import BlockchainApiService from '../BlockchainApiService';
import StorageService from '../../common/services/storage.service';

import appStores from '../../../AppStores';
import logService from '../../common/services/log.service';

const sign = require('ethjs-signer').sign;

class Web3Service {
  contractInstances = {};
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
    if (!privateKey) {
      return null;
    }

    if (privateKey.substr(0, 2).toLowerCase() !== '0x') {
      privateKey = `0x${privateKey}`;
    }

    return this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
  }

  async getCurrentWalletAddress(onlyWithPrivateKey = false) {
    return (await BlockchainWalletService.getCurrent(onlyWithPrivateKey)).address;
  }

  // Eth

  async getBalance(address) {
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
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
      from: await this.getCurrentWalletAddress(true)
    }
  }

  // Contract methods

  async sendSignedContractMethod(method, message = '') {
    return await this.sendSignedContractMethodWithValue(method, 0, message);
  }

  wait() {
    return new Promise(r => setTimeout(r, 500));
  }

  async sendSignedContractMethodWithValue(method, value = 0, message = '') {
    const toHex = this.web3.utils.toHex,
      baseOptions = await this.getTransactionOptions();

    const privateKey = await BlockchainWalletService.unlock(baseOptions.from);

    let estimatedGas = 0;
    try {
      let latestBlock = await this.web3.eth.getBlock('latest');

      estimatedGas = await method.estimateGas({
        from: baseOptions.from,
        to: method._parent.options.address,
        gas: latestBlock.gasLimit,
        value: value,
      });
    } catch (e) {
      logService.exception('[Web3Service]', e);
    }

    const sendOptions = await appStores.blockchainTransaction.waitForApproval(method, message, baseOptions, Math.ceil(estimatedGas * 1.5), value);
    await this.wait(); // Modals have a "cooldown"

    if (sendOptions) {
      const nonce = await this.web3.eth.getTransactionCount(sendOptions.from);

      const tx = {
        nonce,
        from: sendOptions.from,
        to: method._parent.options.address,
        data: method.encodeABI(),
        value: toHex(value),
        gas: toHex(parseInt(sendOptions.gasLimit, 10)),
        gasPrice: toHex(this.web3.utils.toWei(`${sendOptions.gasPrice}`, 'gwei')),
      }, signedTx = sign(tx, privateKey);

      return await new Promise((resolve, reject) => {
        this.web3.eth.sendSignedTransaction(signedTx)
          .once('transactionHash', hash => resolve({ transactionHash: hash }))
          .once('error', e => reject(e));
      });
    } else {
      throw new Error('E_CANCELLED');
    }
  }
}

export default new Web3Service();
