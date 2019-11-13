import { observable, action } from 'mobx';
import BaseModel from '../common/BaseModel';
import ReferralsService from './ReferralsService';

/**
 * Referral model
 */
export default class ReferralModel extends BaseModel {

  @observable pingable;

  @observable pingInProgress;

  async ping() {
    console.log('pinggggg', this);
    if (this.cantPing()) {
      return;
    }

    this.togglePingInProgress();
    console.log('ping in progress,', this.pingInProgress);
    try {
      const done = await ReferralsService.pingReferral(this.prospect.guid);
      console.log('done,', done);
      if (done) {
        this.toggleBothConditions();
      } else {
        throw new Error('Error: ping incomplete');
      }
    } catch (err) {
      this.togglePingInProgress();
      throw(err);
    }
  }

  cantPing() {
    console.log(!this.isPinglable() || this.isPingInProgress());
    return !this.isPinglable() || this.isPingInProgress();
  }

  isPinglable() {
    return this.pingable;
  }

  isPingInProgress() {
    return this.pingInProgress;
  }

  @action
  togglePingInProgress() {
    this.pingInProgress = !this.pingInProgress;
  }

  @action
  togglePingable() {
    this.pingable = !this.pingable;
  }

  @action
  toggleBothConditions() {
    this.togglePingInProgress();
    this.togglePingable();
  }
}
