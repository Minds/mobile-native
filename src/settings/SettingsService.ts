import api from '~/common/services/api.service';
import sessionService from '~/common/services/session.service';

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

  /**
   * Show boosts from the feeds
   */
  showBoosts() {
    const user = sessionService.getUser();
    if (user.plus) {
      return api.delete('api/v1/plus/boost');
    }
  }

  /**
   * Hide boosts from the feeds
   */
  hideBoosts() {
    const user = sessionService.getUser();
    if (user.plus) {
      return api.put('api/v1/plus/boost');
    }
  }
}

export default new SettingsService();
