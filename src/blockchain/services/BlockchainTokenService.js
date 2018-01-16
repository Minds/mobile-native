import Web3Service from './Web3Service';

class BlockchainTokenService {
  async getContract() {
    return await Web3Service.getContract('token');
  }

  async increaseApproval(address, amount, message = '') {
    const token = await this.getContract();

    const tokenApprove = await token.methods.approve(
      address,
      Web3Service.web3.utils.toWei(amount.toString(), 'ether')
    );

    const result = await Web3Service.sendSignedContractMethod(
      tokenApprove,
      `Approve ${address} to spend ${amount} tokens in the future. ${message}`.trim()
    );

    return result.transactionHash;
  }

  encodeParams(params) {
    const types = [ 'uint256', 'uint256' ],
      values = [ 0x80, 0x40 ];

    for (let param of params) {
      types.push(param.type);
      values.push(param.value);
    }

    return Web3Service.web3.eth.abi.encodeParameters(types, values);
  }
}

export default new BlockchainTokenService();
