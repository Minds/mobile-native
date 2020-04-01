//@ts-nocheck
import {
  observable,
  action
} from 'mobx';

import channelService from './ChannelService';
import ChannelStore from './ChannelStore';
import wireService from '../wire/WireService';
import ModelStorageList from '../common/ModelStorageList';
import logService from '../common/services/log.service';
import channelsService from '../common/services/channels.service';
import UserModel from './UserModel';

/**
 * Channel Stores
 */
class ChannelStores {

  lastVisited = new ModelStorageList('lastchannels', 30);
  stores = {};

  store(guid) {
    if (!this.stores[guid]) {
      this.stores[guid] = new ChannelStore(guid);
    }
    return this.stores[guid];
  }

  async storeByName(name) {
    const response = await channelService.load(name);
    const channel = response.channel;
    const store = this.store(channel.guid);
    // save it to the local storages
    channelsService.save(channel);

    store.setChannel(channel, true);
    return store;
  }

  @action
  garbageCollect() {
    let count = 0;
    for (guid in this.stores) {
      //garbage collect if the store isn't actively in use
      //and more than 5 stores are open
      if (this.stores[guid] && !this.stores[guid].active && count++ > 5) {
        this.stores[guid] = null;
        logService.log(`[ChannelStores] GARBAGE COLLECTED: ${guid}`);
      }
    }
  }

  /**
   * Add a visited channel to the list
   * if the channel is already in the list it moves it to the top
   * @param {UserModel} channel
   */
  async addVisited(channel) {
    result = await this.lastVisited.unshift(channel);
    // if it already exist we move it to the beggining
    if (result == -1) this.lastVisited.moveFirst(channel.guid);
  }

  /**
   * Get latest visited channels
   * @param {number} count
   */
  async getVisited(count) {
    const result = await this.lastVisited.first(count);
    return UserModel.createMany(result);
  }

  @action
  reset() {
    this.lastVisited.clear();
    this.stores = {};
  }

}

export default ChannelStores;
