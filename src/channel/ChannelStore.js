import {
  observable,
  action
} from 'mobx';

import channelService from './ChannelService';
import wireService from '../wire/WireService';
import ChannelFeedStore from './ChannelFeedStore';
import UserModel from './UserModel';

/**
 * Channel Store
 */
export default class ChannelStore {

  guid = null;
  feedStore = null;

  constructor(guid) {
    this.guid = guid;
    this.feedStore = new ChannelFeedStore(guid);
  }

  // only observable by reference because UserModel already have the needed observables
  @observable.ref channel = {};

  @observable rewards = {};
  @observable active = false;

  @action
  clear() {
    this.channel = {};
    this.rewards = {};
  }

  @action
  markInactive() {
    this.active = false;
  }

  @action
  setChannel(channel) {
    this.channel = channel;
    this.active = true;
  }

  @action
  async load() {
    const { channel } = await channelService.load(this.guid);
    if (channel)
      this.setChannel(UserModel.create(channel));
  }

  @action
  async loadFeeds() {
    await this.feedStore.load();
  }

  @action
  subscribe() {
    let value = !this.channel.subscribed;
    return channelService.toggleSubscription(this.channel.guid, value)
      .then(response => {
        this.channel.subscribed = value;
      })
      .catch(err => {
        this.channel.subscribed = !value;
        console.log('error');
      });
  }


  @action
  toggleBlock() {
    let value = !this.channel.blocked;
    return channelService.toggleBlock(this.channel.guid, value)
      .then(response => {
        this.channel.blocked = value;
      })
      .catch(err => {
        this.channel.blocked = !value;
        console.log('error');
      });
  }

  @action
  loadrewards(guid) {
    wireService.rewards(guid)
      .then(action(rewards => {
        if (rewards) {
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
