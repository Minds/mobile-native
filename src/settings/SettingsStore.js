import { observable, action } from 'mobx'
import settingsService from './SettingsService';
import logService from '../common/services/log.service';

/**
 * Store for the values held in Settings.
 */
class SettingsStore {
  
  @observable appLogActive = null;
  @observable leftHandedActive = null;

  /**
   * Initializes local variables with their correct values as stored locally.
   * Await to guarantee completion & ensure that this is called prior to using the Store.
   */
  @action.bound
  async init(){
    leftHandedActive = await settingsService.getLocal('LeftHandedActive');
    appLogActive = await settingsService.getLocal('AppLogActive') || true;
  } 

  /**
   * Sets in local store and changes this class variable
   */
  set appLogActive(value){
    settingsService.setLocal('AppLogActive', value);
    appLogActive = value;
  }

  /**
   * Sets in local store and changes this class variable
   */
  set leftHandedActive(value) {
    logService.setActive(value);
    leftHandedActive = value;
  }

}
export default new SettingsStore;
