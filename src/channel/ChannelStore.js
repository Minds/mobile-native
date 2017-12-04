import {
  observable,
  action
} from 'mobx';

import channelService from './ChannelService';
import wireService from '../wire/WireService';

/**
 * Channel Store
 */
class ChannelStore {
  @observable channel = {};
  @observable rewards = {};

  @action
  clear() {
    this.channel = {};
    this.rewards = {};
  }

  @action
  setChannel(channel) {
    this.channel = channel;
  }

  @action
  load(guid) {
    this.channel = {};
    channelService.load(guid)
      .then(response => {
        this.setChannel(response.channel);
      })
      .catch(err => {
        console.log('error');
      });
  }

  @action
  loadrewards(guid) {
    wireService.rewards(guid)
      .then(action(rewards => {
        this.rewards = rewards || {};
      }))
      .catch(err => {
        console.log('error', err);
      });
  }
}

export default new ChannelStore();
