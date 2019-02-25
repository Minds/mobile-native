import api from './api.service';
import { AsyncStorage } from 'react-native';


class MindsService {
  settings;

  async getSettings() {
    let settings;
    if (!this.settings) {
      try {
        settings = await api.get('api/v1/minds/config');
        AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
      } catch (err) {
        settings = await AsyncStorage.getItem('@MindsSettings');
      }

      if (settings) {
        this.settings = settings;
      }
    }

    return this.settings;
  }
}

export default new MindsService();
