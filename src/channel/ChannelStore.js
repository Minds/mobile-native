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

  @action
  loadrewards(guid) {
    wireService.rewards(guid)
      .then(action(rewards => {
        console.log(rewards);
        this.rewards = rewards;
      }))
      .catch(err => {
        console.log('error', err);
      });
  }
}

export default new ChannelStore();
