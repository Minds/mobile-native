import Web3Service from './Web3Service';
import BlockchainTokenService from './BlockchainTokenService';
import i18n from '../../common/services/i18n.service';
import type { TransactionResponse } from './BlockchainServicesTypes';

class BlockchainWireService {
  async getContract() {
    return await Web3Service.getContract('wire');
  }

  /**
   * Create an onchain tokens wireß
   * @param {string} receiver
   * @param {number} tokensAmount
   * @param {string} message
   */
  async create(
    receiver: string,
    tokensAmount: number,
    message = '',
  ): Promise<string> {
    const token = await BlockchainTokenService.getContract(),
      wireAddress = (await this.getContract()).options.address;

    const tokenApproveAndCallWire = await token.methods.approveAndCall(
      wireAddress,
      Web3Service.web3.utils.toWei(tokensAmount.toString(), 'ether'),
      BlockchainTokenService.encodeParams([
        { type: 'address', value: receiver },
      ]),
    );

    const result: TransactionResponse = await Web3Service.sendSignedContractMethod(
      tokenApproveAndCallWire,
      i18n.t('blockchain.wire', { tokensAmount, receiver, message }).trim(),
    );

    return result.transactionHash;
  }

  /**
   * Create a eth wire
   * @param {string} receiver
   * @param {number} tokensAmount
   */
  async createEth(receiver: string, tokensAmount: number) {
    const result = await Web3Service.sendEth(receiver, tokensAmount);

    return result.transactionHash;
  }
}

export default new BlockchainWireService();
