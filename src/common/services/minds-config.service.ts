import api from './api.service';
import { storages } from './storage/storages.service';

/**
 * Minds Service
 */
class MindsConfigService {
  settings: any;

  /**
   * Lazy load default settings
   */
  loadDefault = () => require('../../../settings/default.json');

  /**
   * Update the settings from the server
   */
  async update() {
    const settings = await api.get<any>('api/v1/minds/config');
    storages.user?.setMap('mindsSettings', settings);

    this.settings = settings;
  }

  /**
   * Get settings
   */
  getSettings() {
    let settings;
    if (!this.settings) {
      settings = storages.user?.getMap('mindsSettings');
      if (!settings) {
        settings = this.loadDefault();
      }
      this.settings = settings;
    }

    return this.settings;
  }

  /**
   * clear
   */
  clear() {
    this.settings = undefined;
    storages.user?.removeItem('mindsSettings');
  }
}

const mindsConfigService = new MindsConfigService();

export default mindsConfigService;
