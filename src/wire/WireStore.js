import {
  observable,
  action
} from 'mobx'

import { Alert } from 'react-native';

import wireService from './WireService';

/**
 * Wire store
 */
class WireStore {

  @observable amount  = 1;
  @observable sending = false;
  @observable.shallow owner = null;
  @observable recurring = false;

  guid = null;

  setGuid(guid) {
    this.guid = guid;
  }

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
        console.log(owner)
        this.setOwner(owner);
        return owner;
      });
  }

  round(number, precision) {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  /**
   * Get formated amount
   */
  formatAmount(amount) {
    return amount.toLocaleString('en-US') + ' tokens';
  }

  validate() {
    //TODO: implement wire validation
  }

  @action
  setRecurring(recurring) {
    this.recurring = !!recurring;
  }

  @action
  toggleRecurring() {
    this.recurring = !this.recurring;
  }

  /**
   * Confirm and Send wire
   */
  async send() {
    if (this.sending) {
      return;
    }

    try {
      this.sending = true;

      await wireService.send({
        amount: this.amount,
        guid: this.guid,
        owner: this.owner,
        recurring: this.recurring
      });
    } catch (e) {
      this.stopSending();
      throw e;
    } finally {
      this.stopSending();
    }
  }

  @action
  stopSending() {
    this.sending = false;
  }

  @action 
  reset() {
    this.amount = 1;
    this.sending = false;
    this.owner = null;
    this.recurring = false;
    this.guid = null;
  }

}

export default new WireStore()
