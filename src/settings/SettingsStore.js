import { observable, action } from 'mobx'

import logService from '../common/services/log.service';
import storageService from '../common/services/storage.service';

/**
 * Store for the values held in Settings.
 */
class SettingsStore {

  @observable appLog = true;
  @observable leftHanded = null;

  /**
   * Initializes local variables with their correct values as stored locally.
   * Await to guarantee completion & ensure that this is called prior to using the Store.
   */
  @action.bound
  async init() {
    this.leftHanded = await storageService.getItem('LeftHanded');
    this.appLog = await storageService.getItem('AppLog');
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

}
export default new SettingsStore;
