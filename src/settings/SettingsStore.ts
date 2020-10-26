//@ts-nocheck
import { observable, action } from 'mobx';

import storageService from '../common/services/storage.service';
import { getStores } from '../../AppStores';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Store for the values held in Settings.
 */
export class SettingsStore {
  @observable appLog = true;
  @observable leftHanded = null;
  @observable ignoreBestLanguage = '';

  consumerNsfw = [];
  creatorNsfw = [];
  useHashtag = true;
  composerMode = 'photo';

  /**
   * Initializes local variables with their correct values as stored locally.
   * Await to guarantee completion & ensure that this is called prior to using the Store.
   */
  @action.bound
  async init() {
    const data = await storageService.multiGet([
      'LeftHanded',
      'AppLog',
      'CreatorNsfw',
      'ConsumerNsfw',
      'UseHashtags',
      'Theme',
      'IgnoreBestLanguage',
      'ComposerMode',
    ]);

    // store theme changes
    ThemedStyles.onThemeChange((value) => {
      this.setTheme(value);
    });

    if (!data) {
      ThemedStyles.theme = 0;
      ThemedStyles.init();
      return this;
    }

    this.leftHanded = data[0][1];
    this.appLog = data[1][1];
    this.creatorNsfw = data[2][1] || [];
    this.consumerNsfw = data[3][1] || [];
    this.useHashtags = data[4][1] === null ? true : data[4][1];
    this.ignoreBestLanguage = data[6][1] || '';
    this.composerMode = data[7][1] || 'photo';

    // set the initial value for hashtag
    getStores().hashtag.setAll(!this.useHashtags);

    // theme
    ThemedStyles.setTheme(data[5][1] || 0);

    return this;
  }

  /**
   * Set ignore best language
   * @param value string
   */
  @action
  setIgnoreBestLanguage(value: string) {
    this.ignoreBestLanguage = value;
    storageService.setItem('IgnoreBestLanguage', value);
  }

  /**
   * Set the theme in the stored values
   * @param {numeric} value
   */
  setTheme(value) {
    storageService.setItem('Theme', value);
  }
  /**
   * Set composer mode
   * @param {string} value
   */
  setComposerMode(value: string) {
    storageService.setItem('ComposerMode', value);
    this.composerMode = value;
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

  setUseHashtags(value) {
    storageService.setItem('UseHashtags', value);
    this.useHashtags = value;
  }
}
export default new SettingsStore();
