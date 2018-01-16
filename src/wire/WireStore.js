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
  @observable method  = 'money';
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
        this.setOwner(owner);
        return owner;
      });
  }

  @action
  setMethod(method) {
    if (this.method == 'points' && method == 'money')
      this.amount = this.amount / 500;

    if (this.method == 'points' && method == 'tokens')
      this.amount = this.amount / 500; // hook to live rate

    if (this.method == 'money' && method == 'points')
      this.amount = this.amount * 500;

    if (this.method == 'money' && method == 'tokens')
      this.amount = this.amount; //hook to the live tokens rate

    if (this.method == 'tokens' && method == 'money')
      this.amount = this.round(this.amount, 2); //hook to the live tokens rate

    if (this.method == 'tokens' && method == 'points')
      this.amount = this.amount * 500;

    this.method = method;
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
    switch (this.method) {
      case 'points':
        return amount.toLocaleString('en-US') + ' points';
      case 'money':
        return '$' + amount.toLocaleString('en-US');
      case 'tokens':
        return amount.toLocaleString('en-US') + ' tokens';
    }
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
        method: this.method,
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
}

export default new WireStore()
