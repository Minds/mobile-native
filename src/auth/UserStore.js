import {
  observable,
  action
} from 'mobx';

import channelService from './../channel/ChannelService';
import sessionService from '../common/services/session.service';
import UserModel from './../channel/UserModel';
import { MINDS_FEATURES } from '../config/Config';
import { Alert } from 'react-native';

/**
 * Login Store
 */
class UserStore {
  @observable me = {};

  @action
  setUser(user) {
    if (!user || !user.guid) 
      return
    this.me = UserModel.create(user);
    sessionService.guid = user.guid;
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
  async load() {
    this.me = {};

    try {
      let response = await channelService.load('me');

      //if (!response.channel) {
      //  return sessionService.setToken(null);
      //}

      this.setUser(response.channel);
      if (this.me.canCrypto) {
        MINDS_FEATURES.crypto = true;
      }
    } catch(err)  {
      console.log('error', err);
    }
  }

  isAdmin() {
    return this.me.admin;
  }

  @action
  reset() {
    this.me = {};
  }

}

export default UserStore;
