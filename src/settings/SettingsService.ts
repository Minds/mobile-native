import api from '~/common/services/api.service';

/**
 * Settings Service
 */
class SettingsService {
  /**
   * Get Settings
   */
  getSettings() {
    return api.get<any>('api/v1/settings').then(result => {
      return result;
    });
  }

  /**
   * Submit Settings
   */
  submitSettings(params) {
    return api.post('api/v1/settings', params).then(result => {
      return result;
    });
  }
}

export default new SettingsService();
