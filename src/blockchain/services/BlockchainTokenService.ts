//@ts-nocheck
import Web3Service from './Web3Service';
import i18n from '../../common/services/i18n.service';

class BlockchainTokenService {
  async getContract() {
    return await Web3Service.getContract('token');
  }

  async increaseApproval(address, tokensAmount, message = '') {
    const token = await this.getContract();

    const tokenApprove = await token.methods.approve(
      address,
      Web3Service.web3.utils.toWei(tokensAmount.toString(), 'ether')
    );

    const result = await Web3Service.sendSignedContractMethod(
      tokenApprove,
      i18n.t('blockchain.tokenApprove',{address, tokensAmount, message}).trim()
    );

    return result.transactionHash;
  }

  async balanceOf(address) {
    const token = await this.getContract(),
      balance = await token.methods.balanceOf(address).call();

    return Web3Service.web3.utils.fromWei(balance, 'ether');
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
