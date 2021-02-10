import web3Util from 'web3-utils';

import BlockchainTokenService from './BlockchainTokenService';
import MindsService from '../../../common/services/minds.service';

import ContractServiceAbstract, {
  ContractName,
} from './ContractServiceAbstract';

/**
 * Blockchain boost services
 */
class BlockchainBoostService extends ContractServiceAbstract {
  /**
   * Returns the contract name
   */
  getContractName(): ContractName {
    return 'boost';
  }
  /**
   * Create a new boost
   * @param guid GUID to boost
   * @param amount
   * @param checksum
   * @param from
   */
  async create(guid: string, amount: string, checksum: string, from: string) {
    const settings = (await MindsService.getSettings()).blockchain;

    const token = await this.getContract('token'),
      boostAddress = settings.boost.address,
      boostWalletAddress = settings.boost_wallet_address;

    const checksumInt = web3Util.toBN('0x' + checksum).toString();

    const tokenApproveAndCallBoost = await token.methods.approveAndCall(
      boostAddress,
      amount,
      BlockchainTokenService.encodeParams(
        [
          { type: 'address', value: boostWalletAddress },
          { type: 'uint256', value: guid },
          { type: 'uint256', value: checksumInt },
        ],
        this.web3,
      ),
    );

    const result = await this.sendContractMethod(
      token,
      from,
      tokenApproveAndCallBoost,
    );

    return result.transactionHash;
  }

  /**
   * Create a p2p boost
   * @param receiver
   * @param guid
   * @param amount
   * @param checksum
   * @param from
   */
  async createPeer(
    receiver: string,
    guid: string,
    amount: string,
    checksum: string,
    from: string,
  ) {
    const settings = (await MindsService.getSettings()).blockchain;
    const token = await this.getContract('token'),
      boostAddress = settings.boost.address;

    const tokenApproveAndCallBoost = await token.methods.approveAndCall(
      boostAddress,
      amount,
      BlockchainTokenService.encodeParams(
        [
          { type: 'address', value: receiver },
          { type: 'uint256', value: guid },
          { type: 'uint256', value: checksum },
        ],
        this.web3,
      ),
    );

    const result = await this.sendContractMethod(
      token,
      from,
      tokenApproveAndCallBoost,
    );

    return result.transactionHash;
  }
}

export default BlockchainBoostService;
