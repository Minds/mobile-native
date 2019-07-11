import { observable, action } from 'mobx'

import logService from '../common/services/log.service';
import storageService from '../common/services/storage.service';

/**
 * Store for the values held in Settings.
 */
class SettingsStore {

  @observable appLog = true;
  @observable leftHanded = null;

  consumerNsfw = [];
  creatorNsfw = [];

  /**
   * Initializes local variables with their correct values as stored locally.
   * Await to guarantee completion & ensure that this is called prior to using the Store.
   */
  @action.bound
  async init() {
    const data  = await storageService.multiGet(['LeftHanded', 'AppLog', 'CreatorNsfw', 'ConsumerNsfw']);
    if (!data) return;
    this.leftHanded = data[0][1];
    this.appLog = data[1][1];
    this.creatorNsfw = data[2][1];
    this.consumerNsfw = data[3][1];
    return this;
  }

  /**
   * Sets in local store and changes this class variable
   */
  @action
  setAppLog(value) {
    storageService.setItem('AppLog', value);
    this.appLog = value;
  }

  /**
   * Sets in local store and changes this class variable
   */
  @action
  setLeftHanded(value) {
    storageService.setItem('LeftHanded', value);
    this.leftHanded = value;
  }

  setCreatorNsfw(value) {
    storageService.setItem('CreatorNsfw', value);
    this.creatorNsfw = value;
  }

  setConsumerNsfw(value) {
    storageService.setItem('ConsumerNsfw', value);
    this.consumerNsfw = value;
  }

}
export default new SettingsStore;
