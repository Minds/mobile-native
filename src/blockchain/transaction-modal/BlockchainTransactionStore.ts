//@ts-nocheck
import { observable, action, observe } from 'mobx';
import BlockchainWalletService from '../wallet/BlockchainWalletService';
import BlockchainApiService from '../BlockchainApiService';
import Web3Service from '../services/Web3Service';
import i18n from '../../common/services/i18n.service';

let approvalDispose;

/**
 * Blockchain Transaction Store
 */
class BlockchainTransactionStore {
  @observable isApproving = false;
  @observable approvalMessage = '';
  @observable approval = void 0;
  @observable baseOptions = {};
  @observable estimateGasLimit = 0;
  @observable funds = null;
  @observable gweiPriceCents = null;
  @observable weiValue = null;

  @action async waitForApproval(
    method,
    approvalMessage,
    baseOptions = {},
    estimatedGas = 0,
    weiValue = 0,
  ) {
    if (this.isApproving) {
      throw new Error(i18n.t('blockchain.alreadyApproving'));
    }

    this.approvalMessage = approvalMessage;
    this.approval = void 0;
    this.baseOptions = baseOptions;
    this.estimateGasLimit = estimatedGas;
    this.funds = null;
    this.gweiPriceCents = null;
    this.weiValue = weiValue;

    this.isApproving = true;

    this.refreshFunds();
    this.getGweiPriceCents();

    return await new Promise((resolve) => {
      if (approvalDispose) {
        approvalDispose();
        approvalDispose = void 0;
      }

      approvalDispose = observe(
        this,
        'approval',
        action((change) => {
          approvalDispose();

          this.isApproving = false;

          this.approvalMessage = '';
          this.approval = void 0;
          this.baseOptions = {};
          this.estimateGasLimit = 0;
          this.funds = null;
          this.gweiPriceCents = null;
          this.weiValue = 0;

          if (change.newValue) {
            resolve(change.newValue);
          } else {
            resolve(false);
          }
        }),
      );
    });
  }

  @action approveTransaction(data) {
    this.isApproving = false;

    this.approvalMessage = '';
    this.approval = {
      ...this.baseOptions,
      ...(data || {}),
    };
    this.baseOptions = {};
    this.estimateGasLimit = 0;
    this.funds = null;
    this.gweiPriceCents = null;
    this.weiValue = 0;
  }

  @action rejectTransaction() {
    this.isApproving = false;

    this.approvalMessage = '';
    this.approval = false;
    this.baseOptions = {};
    this.estimateGasLimit = 0;
    this.funds = null;
    this.gweiPriceCents = null;
    this.weiValue = 0;
  }

  @action
  async refreshFunds() {
    if (!this.baseOptions.from) {
      this.funds = null;
      return;
    }

    this.funds = await BlockchainWalletService.getFunds(this.baseOptions.from);
  }

  async getGweiPriceCents() {
    const ethPrice = await BlockchainApiService.getUSDRate();

    if (ethPrice === null) {
      this.gweiPriceCents = null;
      return;
    }

    const gweiRate = Web3Service.web3.utils.fromWei(
      Web3Service.web3.utils.toWei('1', 'ether'),
      'gwei',
    );

    // NOTE: Saving in cents to avoid JS rounding issue
    const ethPriceInCents = ethPrice * 100;
    this.gweiPriceCents = ethPriceInCents / gweiRate;
  }

  @action
  reset() {
    this.isApproving = false;
    this.approvalMessage = '';
    this.approval = void 0;
    this.baseOptions = {};
    this.estimateGasLimit = 0;
    this.funds = null;
    this.gweiPriceCents = null;
    this.weiValue = 0;
  }
}

export default BlockchainTransactionStore;
