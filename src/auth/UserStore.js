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
    this.me = user;
  }

  @action
  clearUser() {
    this.me = {};
  }

  @action
  load() {
    this.me = {};
     return channelService.load('me')
      .then(action(response => {
        this.me = response.channel;
      }))
      .catch(err => {
        console.log('error', err);
      });
  }

  isAdmin() {
    return this.me.admin;
  }
}

export default new UserStore();
