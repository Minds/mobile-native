import {
  observable,
  computed,
  action
} from 'mobx';

import apiService from '../../common/services/api.service';
import WithdrawService from './WithdrawService';

class WithdrawStore {
  @observable ledger = [];

  @action async load() {
    const startDate = new Date(),
      endDate = new Date();

    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setHours(0, 0, 0);

    endDate.setHours(23, 59, 59);

    this.ledger = [];

    const response = await apiService.get(`api/v2/blockchain/transactions/withdrawals`, {
      from: Math.floor(+startDate / 1000),
      to: Math.floor(+endDate / 1000)
    });

    this.ledger = response.withdrawals || [];
  }

  @action async withdraw(guid, amount) {
    const entity = await WithdrawService.withdraw(guid, amount);

    if (entity) {
      this.ledger.unshift(entity);
    }
  }

  reset() {
    this.ledger = [];
  }
}

export default WithdrawStore;
