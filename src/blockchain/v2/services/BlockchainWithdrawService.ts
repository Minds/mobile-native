import ContractServiceAbstract from './ContractServiceAbstract';

/**
 * Blockchain withdraw services
 */
export default class BlockchainWithdrawService extends ContractServiceAbstract {
  /**
   * Request withdraw
   * @param guid
   * @param tokensAmount
   * @param to destination address
   */
  async request(guid: string, tokensAmount: number | string, to: string) {
    const withdraw = await this.getContract('withdraw'),
      weiAmount = this.web3.utils.toWei(`${tokensAmount}`, 'ether'),
      gasLimit = this.web3.utils.toBN(167839), //TODO: make this dynamic
      gasPrice = this.web3.utils.toBN(this.web3.utils.toWei('1', 'Gwei')),
      gas = gasPrice.mul(gasLimit); // TODO: make this dynamic

    const withdrawRequest = await withdraw.methods.request(guid, weiAmount);

    const result = await this.sendContractMethodWithValue(
      withdraw,
      to,
      withdrawRequest,
      gas.toString(),
    );

    return {
      address: to,
      amount: weiAmount.toString(),
      tx: result.transactionHash,
      gas: gas.toString(),
    };
  }
}
