import Web3Service from './Web3Service';
import BlockchainTokenService from './BlockchainTokenService';
import MindsService from '../../common/services/minds.service';

class BlockchainBoostService {
  async getContract() {
    return await Web3Service.getContract('boost');
  }

  async create(guid, amount, checksum, message = '') {
    const settings = (await MindsService.getSettings()).blockchain;

    const token = await BlockchainTokenService.getContract(),
      boostAddress = (await this.getContract()).options.address,
      boostWalletAddress = settings.boost_wallet_address,
      tokensAmount = Web3Service.web3.utils.fromWei(amount, 'ether');

    const tokenApproveAndCallBoost = await token.methods.approveAndCall(
      boostAddress,
      amount,
      BlockchainTokenService.encodeParams([ { type: 'address', value: boostWalletAddress }, { type: 'uint256', value: guid }, { type: 'uint256', value: checksum } ])
    );

    const result = await Web3Service.sendSignedContractMethod(
      tokenApproveAndCallBoost,
      `Network Boost for ${tokensAmount} Minds Tokens. ${message}`.trim()
    );

    return result.transactionHash;
  }

  async createPeer(receiver, guid, amount, checksum, message = '') {
    const token = await BlockchainTokenService.getContract(),
      boostAddress = (await this.getContract()).options.address,
      tokensAmount = Web3Service.web3.utils.fromWei(amount, 'ether');

    const tokenApproveAndCallBoost = await token.methods.approveAndCall(
      boostAddress,
      amount,
      BlockchainTokenService.encodeParams([ { type: 'address', value: receiver }, { type: 'uint256', value: guid }, { type: 'uint256', value: checksum } ])
    );

    const result = await Web3Service.sendSignedContractMethod(
      tokenApproveAndCallBoost,
      `Channel Boost for ${tokensAmount} Minds Tokens to ${receiver}. ${message}`.trim()
    );

    return result.transactionHash;
  }
}

export default new BlockchainBoostService();
