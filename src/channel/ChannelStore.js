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
  @observable avatarProgress = 0;
  @observable bannerProgress = 0;

  constructor(guid) {
    this.guid = guid;
    this.feedStore = new ChannelFeedStore(guid);
  }

  @action
  clear() {
    this.channel = {};
    this.rewards = {};
    this.avatarProgress = 0;
    this.bannerProgress = 0;
    this.isUploading = false;
  }

  @action
  markInactive() {
    this.active = false;
  }

  @action
  setChannel(channel, loaded = false) {
    channel = UserModel.checkOrCreate(channel);
    this.channel = channel;
    this.feedStore.setChannel(channel);
    this.active = true;
    this.guid = channel.guid;

    if (loaded) {
      this.loaded = loaded;
    }
  }

  @action
  async load() {
    const { channel } = await channelService.load(this.guid);
    if (channel) {
      this.loaded = true;
      this.setChannel(channel);
      return channel;
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
  setBannerProgress(value) {
    this.bannerProgress = value;
  }

  @action
  setAvatarProgress(value) {
    this.avatarProgress = value;
  }

  @action
  setIsUploading(value) {
    this.isUploading = value;
  }

  @action
  async uploadAvatar(avatar) {
    this.setIsUploading(true);
    this.avatarProgress = 0;
    const avatarResult = await channelService.upload(this.guid, 'avatar', {
      uri: avatar.uri,
      type: avatar.type,
      name: avatar.fileName || 'avatar.jpg'
    }, e => {
      this.setAvatarProgress(e.loaded / e.total);
    });

    this.setAvatarProgress(100);

    this.setIsUploading(false);
    if (avatarResult.error) return avatarResult.error;
  }

  @action
  async save({ avatar, banner, ...data }) {
    this.bannerProgress = 0;

    try {
      if (avatar) {
        this.uploadAvatar(avatar);
      }

      if (banner) {
        this.isUploading = true;
        const bannerResult = await channelService.upload(this.guid, 'banner', {
          uri: banner.uri,
          type: banner.type,
          name: banner.fileName || 'banner.jpg'
        }, e => {
          this.setBannerProgress(e.loaded / e.total);
        });

        this.setBannerProgress(100);

        if (bannerResult.error) return bannerResult.error;
      }

      const result = await channelService.save(data);
      const success = result && result.status === 'success';

      if (success) {
        this.channel.name = data.name;
        this.channel.briefdescription = data.briefdescription;
      }

      return success;
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
    this.isUploading = false;
  }

}
