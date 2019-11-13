import api from './api.service';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from './i18n.service';

/**
 * Minds Service
 */
class MindsService {
  settings;

  /**
   * Lazy load default settings
   */
  loadDefault = () => require("../../../settings/default.json");

  async update() {
    const settings = await api.get('api/v1/minds/config');
    AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
    this.settings = this.settings;
  }

  /**
   * Get settings
   */
  async getSettings() {
    let settings;
    if (!this.settings) {
      try {
        settings = JSON.parse(await AsyncStorage.getItem('@MindsSettings'));
        if (!settings) throw Error('No settings stored');
      } catch {
        settings = this.loadDefault();
        AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
      }
      this.settings = settings;
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
