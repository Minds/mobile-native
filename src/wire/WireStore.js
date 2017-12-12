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

    if (this.method == 'points' && method == 'mindscoin')
      this.amount = (this.amount / 500) / 1024;

    if (this.method == 'money' && method == 'points')
      this.amount = this.amount * 500;

    if (this.method == 'money' && method == 'mindscoin')
      this.amount = this.amount / 1024; //hook to the live mindscoin rate

    if (this.method == 'mindscoin' && method == 'money')
      this.amount = this.round(this.amount * 1024, 6); //hook to the live mindscoin rate

    if (this.method == 'mindscoin' && method == 'points')
      this.amount = (this.amount * 1024) * 500;

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
      case 'mindscoin':
        return '';
    }
  }

  /**
   * Confirm and Send wire
   * @param {callback} runs after successful wire
   */
  send(cb) {
    if(this.sending) return;

    if (this.method == 'points') {
      Alert.alert(
        'Are you sure?',
        'You will send ' + this.formatAmount(this.amount) + ' to @' + this.owner.username,
        [
          { text: 'Cancel', onPress: () => this.canceledSend(), style: 'cancel' },
          { text: 'OK', onPress: () => this.confirmedSend(cb) },
        ],
        { cancelable: false }
      )
    } else {
      Alert.alert(
        'We\'re working on it!',
        this.method + ' is coming soon.',
        [{ text: 'OK', onPress: () => this.canceledSend()}],
        { cancelable: false }
      )
    }
  }

  @action
  canceledSend() {
    this.sending = false;
  }

  /**
   * Send wire
   * @param {callback} runs after successful wire
   */
  @action
  confirmedSend(cb) {
    this.sending = true;
    wireService.send(this.method, this.amount, this.guid)
      .then(() => {
        this.canceledSend();
        if (cb) {
          setTimeout(() => {
            cb();
          }, 1000);
        }
      })
      .catch((err) => {
        if (!e || e.message != 'user cancelled apple pay') {
          Alert.alert(
            'There was a problem processing payment',
            (err && err.message) || 'Unknown internal error',
            [{ text: 'OK'}],
            { cancelable: false }
          )
        }
        this.canceledSend();
      });
  }
}

export default new WireStore()