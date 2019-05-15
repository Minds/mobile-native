import Web3Service from './Web3Service';
import BlockchainTokenService from './BlockchainTokenService';

class BlockchainWireService {
  async getContract() {
    return await Web3Service.getContract('wire');
  }

  async create(receiver, tokensAmount, message = '') {
    const token = await BlockchainTokenService.getContract(),
      wireAddress = (await this.getContract()).options.address;

    const tokenApproveAndCallWire = await token.methods.approveAndCall(
      wireAddress,
      Web3Service.web3.utils.toWei(tokensAmount.toString(), 'ether'),
      BlockchainTokenService.encodeParams([ { type: 'address', value: receiver } ])
    );

    const result = await Web3Service.sendSignedContractMethod(
      tokenApproveAndCallWire,
      i18n.t('blockchain.wire',{tokensAmount, receiver, message}).trim()
    );

    return result.transactionHash;
  }
}

export default new BlockchainWireService();
