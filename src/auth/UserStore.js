import {
  observable,
  action
} from 'mobx';

import channelService from './../channel/ChannelService';

/**
 * Login Store
 */
class UserStore {
  @observable user = {};

  @action
  setUser(user) {
    this.user = user;
  }

  @action
  clearUser() {
    this.user = {};
  }

  @action
  load(guid) {
    this.user = {};
    channelService.load('me')
      .then(action(response => {
        console.log(response);
        this.user = response.channel;
      }))
      .catch(err => {
        console.log('error', err);
      });
  }
}

export default new UserStore();
