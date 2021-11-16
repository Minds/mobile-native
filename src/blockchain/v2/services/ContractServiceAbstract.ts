import type Web3 from 'web3/types';
import { Contract } from 'web3-eth-contract';

import logService from '../../../common/services/log.service';
import mindsConfigService from '../../../common/services/minds-config.service';
import type { WCStore } from '../walletconnect/WalletConnectContext';

export type TransactionResponse = { transactionHash: string };
export type ContractName = 'token' | 'wire' | 'boost' | 'withdraw';

export default abstract class ContractServiceAbstract {
  web3: Web3;
  wc: WCStore;
  contractInstances = new Map<string, Contract>();

  constructor(web3: Web3, wc: WCStore) {
    this.web3 = web3;
    this.wc = wc;
  }

  /**
   * Call a contract method
   * @param from
   * @param method
   */
  async sendContractMethod(
    contract: Contract,
    from: string,
    method: any,
  ): Promise<TransactionResponse> {
    return await this.sendContractMethodWithValue(contract, from, method, 0);
  }

  /**
   * Call a contract method with a value
   * @param from
   * @param method
   * @param value
   */
  async sendContractMethodWithValue(
    contract: Contract,
    from: string,
    method: any,
    value: number | string = 0,
  ): Promise<TransactionResponse> {
    const toHex = this.web3.utils.toHex;

    // estimate gas
    let estimatedGas = 0;
    try {
      let latestBlock = await this.web3.eth.getBlock('latest');

      estimatedGas = await method.estimateGas({
        from,
        to: contract.options.address,
        gas: latestBlock.gasLimit,
        value: value,
      });

      if (!estimatedGas) {
        estimatedGas = this.web3.utils.toBN(167839).toNumber();
      }
    } catch (e) {
      logService.exception('[Web3Service]', e);
    }

    const nonce = await this.web3.eth.getTransactionCount(from);

    const settings = mindsConfigService.getSettings().blockchain;

    const gasPriceGwei = settings.default_gas_price || 200;

    const tx = {
      nonce,
      from,
      to: contract.options.address,
      data: method.encodeABI(),
      value: toHex(value),
      gas: toHex(Math.ceil(estimatedGas * 1.5)),
      gasPrice: toHex(this.web3.utils.toWei(`${gasPriceGwei}`, 'gwei')),
    };

    return await new Promise((resolve, reject) => {
      this.web3?.eth
        .sendTransaction(tx)
        .once('transactionHash', hash => resolve({ transactionHash: hash }))
        .once('error', e => reject(e));
      // use deep linking to bring focus to the wallet app
      this.wc.openWalletApp();
    });
  }

  /**
   * Returns a singleton instance of a contract
   * @param contract
   */
  async getContract(contract: ContractName) {
    const settings = await ContractServiceAbstract.getContractConfig(contract);

    let instance: Contract;
    if (!this.contractInstances.has(contract)) {
      instance = new this.web3.eth.Contract(settings.abi, settings.address);
      this.contractInstances.set(contract, instance);
    } else {
      instance = this.contractInstances.get(contract) as Contract;
    }

    return instance;
  }

  /**
   * Get the config for a contract
   * @param contract
   */
  static async getContractConfig(
    contract: ContractName,
  ): Promise<{ abi: any; address: string }> {
    const settings = mindsConfigService.getSettings().blockchain;
    return settings[contract];
  }

  /**
   * Send ETH from the selected wallet to the destination address
   * @param {string} from destination ETH address
   * @param {string} to destination ETH address
   * @param {number} amount eth amount
   */
  async sendEth(from, to, amount): Promise<TransactionResponse> {
    const toHex = this.web3.utils.toHex;

    const nonce = await this.web3.eth.getTransactionCount(from);

    const settings = mindsConfigService.getSettings().blockchain;

    const gasPrice =
      (settings && settings.default_gas_price
        ? settings.default_gas_price
        : '20') + ''; // force string

    const tx = {
      nonce,
      to,
      from,
      value: toHex(
        this.web3.utils.toWei(this.web3.utils.toBN(amount), 'ether'),
      ),
      gas: toHex(21000),
      gasPrice: toHex(this.web3.utils.toWei(gasPrice, 'Gwei')), // converts the gwei price to wei
    };

    return await new Promise((resolve, reject) => {
      this.web3?.eth
        .sendTransaction(tx)
        .once('transactionHash', hash => resolve({ transactionHash: hash }))
        .once('error', e => reject(e));
    });
  }
}
