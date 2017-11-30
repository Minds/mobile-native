import {
  observable,
  action
} from 'mobx';

import channelService from './ChannelService';

/**
 * Channel Store
 */
class ChannelStore {
  @observable channel = {};

  @action
  setChannel(ch) {
    this.channel = ch;
  }

  @action
  clearChannel() {
    this.channel = {};
  }

  @action
  load(guid) {
    this.channel = {};
    channelService.load(guid)
      .then(action(response => {
        console.log(response);
        this.channel = response.channel;
      }))
      .catch(err => {
        console.log('error', err);
      });
  }
}

export default new ChannelStore();
