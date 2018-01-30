import {
  observable,
  action,
  observe
} from 'mobx'
import BlockchainWalletService from '../wallet/BlockchainWalletService';

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

  @action async waitForApproval(method, approvalMessage, baseOptions = {}, estimatedGas = 0) {
    if (this.isApproving) {
      throw new Error('Already approving a transaction');
    }

    this.approvalMessage = approvalMessage;
    this.approval = void 0;
    this.baseOptions = baseOptions;
    this.estimateGasLimit = estimatedGas;
    this.funds = null;

    this.isApproving = true;

    this.refreshFunds();

    return await new Promise(resolve => {
      if (approvalDispose) {
        approvalDispose();
        approvalDispose = void 0;
      }

      approvalDispose = observe(this, 'approval', action(change => {
        approvalDispose();

        this.isApproving = false;

        this.approvalMessage = '';
        this.approval = void 0;
        this.baseOptions = {};
        this.estimateGasLimit = 0;
        this.funds = null;

        if (change.newValue) {
          resolve(change.newValue);
        } else {
          resolve(false);
        }
      }));
    });
  }

  @action approveTransaction(data) {
    this.isApproving = false;

    this.approvalMessage = '';
    this.approval = {
      ...this.baseOptions,
      ...(data || {})
    };
    this.baseOptions = {};
    this.estimateGasLimit = 0;
    this.funds = null;
  }

  @action rejectTransaction() {
    this.isApproving = false;

    this.approvalMessage = '';
    this.approval = false;
    this.baseOptions = {};
    this.estimateGasLimit = 0;
    this.funds = null;
  }

  refreshFunds() {
    if (!this.baseOptions.from) {
      this.funds = null;
      return;
    }

    BlockchainWalletService.getFunds(this.baseOptions.from)
      .then(action(funds => this.funds = funds));
  }
}

export default new BlockchainTransactionStore()
