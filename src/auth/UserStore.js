import {
  observable,
  action
} from 'mobx';

import channelService from './../channel/ChannelService';

/**
 * Login Store
 */
class UserStore {
  @observable me = {};

  @action
  setUser(user) {
    if (!user.phone_number_hash) user.phone_number_hash = '';
    this.me = user;
  }

  @action
  setPhoneHash(hash) {
    this.me.phone_number_hash = hash;
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
