//@ts-nocheck
import apiService from "../../common/services/api.service";
import BlockchainWithdrawService from "../../blockchain/services/BlockchainWithdrawService";
import i18n from "../../common/services/i18n.service";

class WithdrawService {
  async getBalance() {
    const response = await apiService.get(`api/v2/blockchain/wallet/balance`);

    if (response && typeof response.addresses !== 'undefined') {
      return {
        balance: response.addresses[1].balance / Math.pow(10, 18),
        available: response.addresses[1].available / Math.pow(10, 18)
      }
    } else {
      throw new Error(i18n.t('wallet.withdraw.errorReadingBalances'));
    }
  }

  async canWithdraw() {
    const response = await apiService.post(`api/v2/blockchain/transactions/can-withdraw`);
    return response.canWithdraw;
  }

  async withdraw(guid, amount) {
    if (!guid) {
      throw new Error('Invalid user');
    }

    if (!amount || amount < 0) {
      throw new Error(i18n.t('wallet.withdraw.errorAmountNegative'));
    }

    if (!(await this.canWithdraw())) {
      throw new Error(i18n.t('wallet.withdraw.errorOnlyOnceDay'));
    }

    const txResponse = await BlockchainWithdrawService.request(guid, amount),
      response = await apiService.post(`api/v2/blockchain/transactions/withdraw`, {
        guid,
        ...txResponse,
      });

    return response && response.entity;
  }
}

export default new WithdrawService();
