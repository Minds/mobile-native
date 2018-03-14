import {
  observable,
  action
} from 'mobx';

import channelService from './../channel/ChannelService';
import UserModel from './../channel/UserModel';
/**
 * Login Store
 */
class UserStore {
  @observable me = {};

  @action
  setUser(user) {
    this.me = UserModel.create(user);
  }

  @action
  setRewards(value) {
    this.me.rewards = !!value;
  }

  @action
  setWallet(value) {
    this.me.eth_wallet = value;
  }

  hasRewards() {
    return !!(this.me && this.me.rewards);
  }

  hasEthWallet() {
    return !!(this.me && this.me.eth_wallet);
  }

  @action
  clearUser() {
    this.me = {};
  }

  @action
  load() {
    this.me = {};
    return channelService.load('me')
      .then(response => {
        this.setUser(response.channel);
      })
      .catch(err => {
        console.log('error', err);
      });
  }

  isAdmin() {
    return this.me.admin;
  }

  @action
  reset() {
    this.me = {};
  }

}

export default new UserStore();
