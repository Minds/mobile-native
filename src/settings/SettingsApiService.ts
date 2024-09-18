import type { ApiService } from '~/common/services/api.service';
import type { SessionService } from '~/common/services/session.service';

/**
 * Settings Service
 */
export class SettingsApiService {
  constructor(private api: ApiService, private session: SessionService) {}

  /**
   * Get Settings
   */
  getSettings() {
    return this.api.get<any>('api/v1/settings').then(result => {
      return result;
    });
  }

  /**
   * Submit Settings
   */
  submitSettings(params) {
    return this.api.post('api/v1/settings', params).then(result => {
      return result;
    });
  }

  /**
   * Show boosts from the feeds
   */
  showBoosts() {
    const user = this.session.getUser();
    if (user.plus) {
      return this.api.delete('api/v1/plus/boost');
    }
  }

  /**
   * Hide boosts from the feeds
   */
  hideBoosts() {
    const user = this.session.getUser();
    if (user.plus) {
      return this.api.put('api/v1/plus/boost');
    }
  }
}
