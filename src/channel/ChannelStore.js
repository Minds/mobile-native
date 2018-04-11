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

  // only observable by reference because UserModel already have the needed observables
  @observable.ref channel = {};

  @observable rewards = {};
  @observable active = false;
  @observable loaded = false;
  @observable isUploading = false;

  constructor(guid) {
    this.guid = guid;
    this.feedStore = new ChannelFeedStore(guid);
  }

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
  setChannel(channel, loaded = false) {
    this.channel = channel;
    this.active = true;
    if(loaded) 
      this.loaded = loaded;
  }

  @action
  async load() {
    const { channel } = await channelService.load(this.guid);
    if (channel) {
      const model = UserModel.create(channel);
      this.loaded = true;
      this.setChannel(model);
      return model;
    }
    return false;
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

  @action
  async save({ avatar, banner, ...data }) {
    this.isUploading = true;

    try {
      if (avatar) {
        const avatarResult = await channelService.upload(this.guid, 'avatar', {
          uri: avatar.uri,
          type: avatar.type,
          name: avatar.fileName || 'avatar.jpg'
        });

        if (avatarResult.error) return avatarResult.error;
      }

      if (banner) {
        const bannerResult = await channelService.upload(this.guid, 'banner', {
          uri: banner.uri,
          type: banner.type,
          name: banner.fileName || 'banner.jpg'
        });
        if (bannerResult.error) return bannerResult.error;
      }

      const result = await channelService.save(this.guid, data);

      return result && result.status === 'success';
    } catch (e) {
      console.error(e);
      return e;
    } finally {
      this.isUploading = false;
    }
  }

  @action
  reset() {
    this.guid = null;
    this.feedStore = null;
    // only observable by reference because UserModel already have the needed observables
    this.channel = {};
    this.rewards = {};
    this.loaded = false;
    this.active = false;
    this.sUploading = false;
  }

}
