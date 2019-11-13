import {
  observable,
  computed,
  action
} from 'mobx';

import OffsetListStore from '../common/stores/OffsetListStore';
import referralsService from './ReferralsService';
import logService from '../common/services/log.service';
import ReferralModel from './ReferralModel';

export default class ReferralsStore {
  list = new OffsetListStore('shallow');
  loading = false;

  /**
   * Load list
   */
  async loadList() {
    try {
      if (this.list.cantLoadMore() || this.loading) {
        return Promise.resolve();
      }
      this.loading = true;
      referrals = await referralsService.getReferrals(this.list.offset);
      referrals.entities = ReferralModel.createMany(referrals.entities);
      this.list.setList(referrals);
      this.loaded = true;
    } catch(err) {
      logService.exception('[ReferralsStore]', err);
    } finally {
      this.loading = false;
    }
  }

  @action
  refresh() {
    this.list.refresh();
    this.loadList()
      .finally(() => {
        this.list.refreshDone();
      });
  }
}
