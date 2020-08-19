//@ts-nocheck
import api from './api.service';
import AsyncStorage from '@react-native-community/async-storage';
// import featuresService from './features.service';

/**
 * Minds Service
 */
class MindsService {
  settings;
  promise;

  /**
   * Lazy load default settings
   */
  loadDefault = () => require('../../../settings/default.json');

  /**
   * Update the settings from the server
   */
  async update() {
    const settings = await api.get('api/v1/minds/config');
    await AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
    this.settings = settings;
    // update the features based on the settings
    // featuresService.updateFeatures();
  }

  /**
   * Get settings
   */
  getSettings() {
    if (!this.promise || this.settings) {
      this.promise = this._getSettings();
    }
    return this.promise;
  }

  /**
   * Get settings
   */
  async _getSettings() {
    let settings;
    if (!this.settings) {
      try {
        settings = JSON.parse(await AsyncStorage.getItem('@MindsSettings'));
        if (!settings) {
          throw Error('No settings stored');
        }
      } catch {
        settings = this.loadDefault();
        await AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
      }
      this.settings = settings;
      // update the features based on the settings
      featuresService.updateFeatures();
      this.update();
    }

    return this.settings;
  }

  /**
   * clear
   */
  clear() {
    this.settings = undefined;
    AsyncStorage.removeItem('@MindsSettings');
  }
}

export default new MindsService();
