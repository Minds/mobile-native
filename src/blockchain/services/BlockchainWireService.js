import Web3Service from './Web3Service';
import BlockchainTokenService from './BlockchainTokenService';

class BlockchainWireService {
  async getContract() {
    return await Web3Service.getContract('wire');
  }

  async create(receiver, amount, message = '') {
    const token = await BlockchainTokenService.getContract(),
      wireAddress = (await this.getContract()).options.address;

    const tokenApproveAndCallWire = await token.methods.approveAndCall(
      wireAddress,
      Web3Service.web3.utils.toWei(amount.toString(), 'ether'),
      BlockchainTokenService.encodeParams([ { type: 'address', value: receiver } ])
    );

    const result = await Web3Service.sendSignedContractMethod(
      tokenApproveAndCallWire,
      `Send ${amount} Minds Tokens to ${receiver}. ${message}`.trim()
    );

    return result.transactionHash;
  }
}

export default new BlockchainWireService();
