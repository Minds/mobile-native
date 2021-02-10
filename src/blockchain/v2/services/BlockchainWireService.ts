import mindsService from '../../../common/services/minds.service';
import BlockchainTokenService from './BlockchainTokenService';
import ContractServiceAbstract from './ContractServiceAbstract';

/**
 * Blockchain wire services
 */
export default class BlockchainWireService extends ContractServiceAbstract {
  /**
   * Create an onchain tokens wire
   * @param {string} receiver
   * @param {number} tokensAmount
   * @param {string} from
   */
  async create(receiver: string, tokensAmount: number, from): Promise<string> {
    const settings = (await mindsService.getSettings()).blockchain;
    const token = await this.getContract('token'),
      wireAddress = settings.wire.address;

    const tokenApproveAndCallWire = await token.methods.approveAndCall(
      wireAddress,
      this.web3.utils.toWei(tokensAmount.toString(), 'ether'),
      BlockchainTokenService.encodeParams(
        [{ type: 'address', value: receiver }],
        this.web3,
      ),
    );

    const result = await this.sendContractMethod(
      token,
      from,
      tokenApproveAndCallWire,
    );

    return result.transactionHash;
  }

  /**
   * Create a eth wire
   * @param {string} receiver
   * @param {number} tokensAmount
   */
  async createEth(from: string, receiver: string, tokensAmount: number) {
    const result = await this.sendEth(from, receiver, tokensAmount);

    return result.transactionHash;
  }
}
