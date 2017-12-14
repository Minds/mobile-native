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
  subscribe() {
    this.channel.subscribed = true;
    channelService.subscribeToChannel(this.channel.guid)
      .then(response => {
        this.channel.subscribed = true;
      })
      .catch(err => {
        this.channel.subscribed = false;
        console.log('error');
      });
  }

  @action
  loadrewards(guid) {
    wireService.rewards(guid)
      .then(action(rewards => {
        if (rewards) {
          // map types
          for (let type in rewards) {
            rewards[type] = rewards[type].map((reward) => {
              reward.type = type;
              return reward;
            });
          }
          // merge rewards
          rewards.merged = rewards.money.concat(rewards.points);
          this.rewards = rewards;
        } else {
          this.rewards = {}
        }

      }))
      .catch(err => {
        console.log('error', err);
      });
  }
}

export default new ChannelStore();
