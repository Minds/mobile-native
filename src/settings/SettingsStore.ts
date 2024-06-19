import { observable, action, computed } from 'mobx';
import connectivityService from '../common/services/connectivity.service';
import moment, { Moment } from 'moment-timezone';
import { storagesService } from '~/common/services/storage/storages.service';

/**
 * Store for the values held in Settings.
 */
export class SettingsStore {
  @observable ignoreBestLanguage = '';
  @observable ignoreOnboarding: Moment | false = false;
  @observable dataSaverMode = false;
  @observable dataSaverModeDisablesOnWiFi = false;

  consumerNsfw = [];
  creatorNsfw = [];
  useHashtag = true;

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
    this.dataSaverMode =
      storagesService.app.getBoolean('dataSaverMode') || false;
    this.dataSaverModeDisablesOnWiFi =
      storagesService.app.getBoolean('dataSaverModeDisablesOnWiFi') || false;
    this.ignoreBestLanguage =
      storagesService.app.getString('ignoreBestLanguage') || '';
  }

  /**
   * Load user related settings
   */
  loadUserSettings() {
    this.creatorNsfw = storagesService.user?.getObject('creatorNSFW') || [];
    this.consumerNsfw = storagesService.user?.getObject('consumerNSFW') || [];
    const ignoreOnboardingDate =
      storagesService.user?.getString('ignoreOnboarding');
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
    storagesService.app.set('ignoreBestLanguage', value);
  }

  /**
   * Set creator NSFW array
   */
  setCreatorNsfw(value) {
    storagesService.user?.setObject('creatorNSFW', value);
    this.creatorNsfw = value;
  }

  /**
   * Set consumer NSFW array
   */
  setConsumerNsfw(value) {
    storagesService.user?.setObject('consumerNSFW', value);
    this.consumerNsfw = value;
  }

  /**
   * Set ignore onboarding date
   */
  @action
  setIgnoreOnboarding(value: Moment | false) {
    storagesService.user?.set(
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
    storagesService.app.set('dataSaverMode', value);
    this.dataSaverMode = value;
  }

  /**
   * Set data saver mode on a Wi-Fi connection
   */
  @action
  setDataSaverModeDisablesOnWiFi(value: boolean) {
    storagesService.app.set('dataSaverModeDisablesOnWiFi', value);
    this.dataSaverModeDisablesOnWiFi = value;
  }
}
export default new SettingsStore();
