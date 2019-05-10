import api from './api.service';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

/**
 * Minds Service
 */
class MindsService {
  settings;

  /**
   * Get settings
   */
  async getSettings() {
    let settings;
    if (!this.settings) {
      try {
        settings = await api.get('api/v1/minds/config');
        AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
      } catch (err) {
        try {
          settings = JSON.parse(await AsyncStorage.getItem('@MindsSettings'));
        } catch {
          settings = null;
        }
      }

      if (settings) {
        this.settings = settings;
      } else {
        return await new Promise(resolve => {
          Alert.alert(
            'Connectivity Issue',
            `Oops there was an error loading the settings from the server\n Please try again.`,
            [
              { text: 'Retry!', onPress: async () => resolve(await this.getSettings()) }
            ]
          );
        });
      }
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
