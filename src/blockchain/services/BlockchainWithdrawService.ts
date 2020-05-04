//@ts-nocheck
import Web3Service from './Web3Service';
import i18n from '../../common/services/i18n.service';

class BlockchainWithdrawService {
  async getContract() {
    return await Web3Service.getContract('withdraw');
  }

  async request(guid, tokensAmount, message = '') {
    const withdraw = await this.getContract(),
      weiAmount = Web3Service.web3.utils.toWei(`${tokensAmount}`, 'ether'),
      gasLimit = 167839, //TODO: make this dynamic
      gasPrice = Web3Service.web3.utils.toWei(`1`, 'Gwei'),
      gas = gasPrice * gasLimit, // TODO: make this dynamic
      gasEther = Web3Service.web3.utils.fromWei(`${gas}`, 'ether');

    const withdrawRequest = await withdraw.methods.request(guid, weiAmount);

    const result = await Web3Service.sendSignedContractMethodWithValue(
      withdrawRequest,
      gas,
      i18n
        .t('blockchain.withdraw', {
          tokensAmount,
          gasEther: gasEther.toString(),
          message,
        })
        .trim(),
    );

    return {
      address: await Web3Service.getCurrentWalletAddress(true),
      amount: weiAmount.toString(),
      tx: result.transactionHash,
      gas: gas.toString(),
    };
  }
}

export default new BlockchainWithdrawService();
