//@ts-nocheck
import { observable, action, computed } from 'mobx';
import connectivityService from '../common/services/connectivity.service';
import moment, { Moment } from 'moment-timezone';
import { storages } from '../common/services/storage/storages.service';

/**
 * Store for the values held in Settings.
 */
export class SettingsStore {
  @observable leftHanded = null;
  @observable ignoreBestLanguage = '';
  @observable ignoreOnboarding: Moment | false = false;
  @observable dataSaverMode = false;
  @observable dataSaverModeDisablesOnWiFi = false;

  consumerNsfw = [];
  creatorNsfw = [];
  useHashtag = true;
  composerMode = 'photo';
  swipeAnimShown = false;

  @computed
  get dataSaverEnabled() {
    let dataSaverEnabled = this.dataSaverMode;
    if (
      this.dataSaverModeDisablesOnWiFi &&
      connectivityService.connectionInfo.type === 'wifi'
    ) {
      dataSaverEnabled = false;
    }

    return dataSaverEnabled;
  }

  constructor() {
    this.leftHanded = storages.app.getBool('leftHanded') || false;
    this.composerMode = storages.app.getString('composerMode') || 'photo';
    this.dataSaverMode = storages.app.getBool('dataSaverMode') || false;
    this.dataSaverModeDisablesOnWiFi =
      storages.app.getBool('dataSaverModeDisablesOnWiFi') || false;
    this.swipeAnimShown = storages.app.getBool('leftHanded') || false;
    this.ignoreBestLanguage =
      storages.app.getArray('ignoreBestLanguage') || false;
  }

  /**
   * Load user related settings
   */
  loadUserSettings() {
    this.creatorNsfw = storages.user?.getArray('creatorNSFW') || [];
    this.consumerNsfw = storages.user?.getArray('consumerNSFW') || [];
    const ignoreOnboardingDate = storages.user?.getString('ignoreOnboarding');
    this.ignoreOnboarding = ignoreOnboardingDate
      ? moment(parseInt(ignoreOnboardingDate, 10))
      : false;
  }

  /**
   * Set ignore best language
   * @param value string
   */
  @action
  setIgnoreBestLanguage(value: string) {
    this.ignoreBestLanguage = value;
    storages.app.setBool('ignoreBestLanguage', value);
  }

  /**
   * Set composer mode
   * @param {string} value
   */
  setComposerMode(value: string) {
    this.composerMode = value;
    storages.app.setString('composerMode', value);
  }

  /**
   * Sets in local store and changes this class variable
   */
  @action
  setLeftHanded(value: boolean) {
    storages.app.setBool('leftHanded', value);
    this.leftHanded = value;
  }

  /**
   * Set swipe animation shown
   */
  setSwipeAnimShown(value: boolean) {
    storages.app.setBool('swipeAnimShown', value);
    this.swipeAnimShown = value;
  }

  /**
   * Set creator NSFW array
   */
  setCreatorNsfw(value: Array) {
    storages.user?.setArray('creatorNSFW', value);
    this.creatorNsfw = value;
  }

  /**
   * Set consumer NSFW array
   */
  setConsumerNsfw(value) {
    storages.user?.setArray('consumerNSFW', value);
    this.consumerNsfw = value;
  }

  /**
   * Set ignore onboarding date
   */
  @action
  setIgnoreOnboarding(value: Moment | false) {
    storages.user?.setString(
      'ignoreOnboarding',
      value ? value.format('x') : '',
    );
    this.ignoreOnboarding = value;
  }

  /**
   * Set data saver mode
   */
  @action
  setDataSaverMode(value: boolean) {
    storages.app.setItem('dataSaverMode', value);
    this.dataSaverMode = value;
  }

  /**
   * Set data saver mode on a Wi-Fi connection
   */
  @action
  setDataSaverModeDisablesOnWiFi(value: boolean) {
    storages.app.setItem('dataSaverModeDisablesOnWiFi', value);
    this.dataSaverModeDisablesOnWiFi = value;
  }
}
export default new SettingsStore();
