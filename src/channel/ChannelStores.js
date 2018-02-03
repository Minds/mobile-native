import {
  observable,
  action
} from 'mobx';

import channelService from './ChannelService';
import ChannelStore from './ChannelStore';
import wireService from '../wire/WireService';

/**
 * Channel Stores
 */
class ChannelStores {

  stores = {};

  @observable
  store(guid) {
    if (!this.stores[guid]) {
      this.stores[guid] = new ChannelStore(guid);
    }
    return this.stores[guid];
  }

  @action
  garbageCollect() {
    let count = 0;
    for (guid in this.stores) {
      //garbage collect if the store isn't actively in use
      //and more than 5 stores are open
      if (this.stores[guid] && !this.stores[guid].active && count++ > 5) {
        this.stores[guid] = null;
        console.log(`[GARBAGE COLLECTED]: ${guid}`);
      }
    }
  }

  @action
  reset() {
    for (guid in this.stores) {
      this.stores[guid] = null;
    }
  }

}

export default new ChannelStores();
