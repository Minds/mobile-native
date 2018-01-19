import Web3Service from './Web3Service';
import BlockchainTokenService from './BlockchainTokenService';
import MindsService from '../../common/services/minds.service';

class BlockchainBoostService {
  async getContract() {
    return await Web3Service.getContract('boost');
  }

  async create(guid, amount, message = '') {
    const settings = (await MindsService.getSettings()).blockchain;

    const token = await BlockchainTokenService.getContract(),
      boostAddress = (await this.getContract()).options.address,
      boostWalletAddress = settings.boost_wallet_address;

    const tokenApproveAndCallBoost = await token.methods.approveAndCall(
      boostAddress,
      Web3Service.web3.utils.toWei(amount.toString(), 'ether'),
      BlockchainTokenService.encodeParams([ { type: 'address', value: boostWalletAddress }, { type: 'uint256', value: guid } ])
    );

    const result = await Web3Service.sendSignedContractMethod(
      tokenApproveAndCallBoost,
      `Network Boost for ${amount} Minds Tokens. ${message}`.trim()
    );

    return result.transactionHash;
  }

  async createPeer(receiver, guid, amount, message = '') {
    const token = await BlockchainTokenService.getContract(),
      boostAddress = (await this.getContract()).options.address;

    const tokenApproveAndCallBoost = await token.methods.approveAndCall(
      boostAddress,
      Web3Service.web3.utils.toWei(amount.toString(), 'ether'),
      BlockchainTokenService.encodeParams([ { type: 'address', value: receiver }, { type: 'uint256', value: guid } ])
    );

    const result = await Web3Service.sendSignedContractMethod(
      tokenApproveAndCallBoost,
      `Channel Boost for ${amount} Minds Tokens to ${receiver}. ${message}`.trim()
    );

    return result.transactionHash;
  }
}

export default new BlockchainBoostService();
