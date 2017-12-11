import {
  observable,
  action
} from 'mobx'

import wireService from './WireService';

/**
 * Wire store
 */
class WireStore {

  @observable amount = 1;
  @observable method = 'money';
  @observable.shallow owner = null;

  @action
  setAmount(val) {
    this.amount = val;
  }

  @action
  setOwner(owner) {
    this.owner = owner;
  }

  loadUser(guid) {
    return wireService.userRewards(guid)
      .then(owner => {
        this.setOwner(owner);
        return owner;
      });
  }

  @action
  setMethod(method) {
    if (this.method == 'points' && method == 'money')
      this.amount = this.amount / 500;

    if (this.method == 'points' && method == 'bitcoin')
      this.amount = (this.amount / 500) / 1024;

    if (this.method == 'money' && method == 'points')
      this.amount = this.amount * 500;

    if (this.method == 'money' && method == 'bitcoin')
      this.amount = this.amount / 1024; //hook to the live bitcoin rate

    if (this.method == 'bitcoin' && method == 'money')
      this.amount = this.round(this.amount * 1024, 6); //hook to the live bitcoin rate

    if (this.method == 'bitcoin' && method == 'points')
      this.amount = (this.amount * 1024) * 500;

    this.method = method;
  }

  round(number, precision) {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }
}

export default new WireStore()