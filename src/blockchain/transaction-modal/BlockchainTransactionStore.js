import {
  observable,
  action,
  observe
} from 'mobx'

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

  @action async waitForApproval(method, approvalMessage, baseOptions = {}, estimatedGas = 0) {
    if (this.isApproving) {
      throw new Error('Already approving a transaction');
    }

    this.approvalMessage = approvalMessage;
    this.approval = void 0;
    this.baseOptions = baseOptions;
    this.estimateGasLimit = estimatedGas;

    this.isApproving = true;

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
  }

  @action rejectTransaction() {
    this.isApproving = false;

    this.approvalMessage = '';
    this.approval = false;
    this.baseOptions = {};
    this.estimateGasLimit = 0;
  }
}

export default new BlockchainTransactionStore()
