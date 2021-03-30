import ContractServiceAbstract from './ContractServiceAbstract';

/**
 * Blockchain token services
 */
export default class BlockchainTokenService extends ContractServiceAbstract {
  /**
   * Increase approval
   * @param address
   * @param tokensAmount
   * @param from
   */
  async increaseApproval(address: string, tokensAmount: number, from: string) {
    const token = await this.getContract('token');

    const tokenApprove = await token.methods.approve(
      address,
      this.web3.utils.toWei(tokensAmount.toString(), 'ether'),
    );

    const result = await this.sendContractMethod(token, from, tokenApprove);

    return result.transactionHash;
  }

  /**
   * Get balance of address
   * @param address
   */
  async balanceOf(address: string) {
    const token = await this.getContract('token'),
      balance = await token.methods.balanceOf(address).call();

    return this.web3.utils.fromWei(balance, 'ether');
  }
  /**
   * Encode params
   * @param params
   * @param web3
   */
  static encodeParams(params, web3) {
    const types = ['uint256', 'uint256'],
      values = [0x80, 0x40];

    for (let param of params) {
      types.push(param.type);
      values.push(param.value);
    }

    return web3.eth.abi.encodeParameters(types, values);
  }

  /**
   * Encode params using local web3
   * @param params
   */
  encodeParams(params) {
    return BlockchainTokenService.encodeParams(params, this.web3);
  }
}
