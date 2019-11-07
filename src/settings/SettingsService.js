import api from './../common/services/api.service';
import { Alert } from 'react-native';
import sessionService from '../common/services/session.service';
import navigationService from '../navigation/NavigationService';
import storageService from '../common/services/storage.service';

/**
 * Settings Service
 */
class SettingsService {

  /**
   * Load Categories
   */
  loadCategories() {
    const rcategories = [];
    return api.get('api/v1/categories')
      .then((categories) => {
        for (let id in categories.categories) {
          rcategories.push({
            id: id,
            label: categories.categories[id],
            selected: false
          });
        }
        rcategories.sort((a, b) => a.label > b.label ? 1 : -1);
        return rcategories;
      });
  }

  /**
   * Get Settings
   */
  getSettings() {
    return api.get('api/v1/settings')
      .then((result) => {
        return result;
      });
  }

  /**
   * Submit Settings
   */
  submitSettings(params) {
    return api.post('api/v1/settings', params)
      .then((result) => {
        return result;
      });
  }

  /**
   * Disable channel
   */
  async disable() {
    try {
      await api.delete('api/v1/channel');
      await sessionService.logout();
      navigationService.navigate('Login');
    } catch (e) {
      Alert.alert('Error disabling the channel');
    }
  }

  /**
   * Delete channel
   */
  async delete(password) {
    console.log(password)
    try {
      await api.post('api/v2/settings/delete', { password });
      await sessionService.logout();
      navigationService.navigate('Login');
    } catch (e) {
      Alert.alert('Error deleting the channel');
    }
  }
}

export default new SettingsService();
