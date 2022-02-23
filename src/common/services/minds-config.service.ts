import api from './api.service';
import featuresService from './features.service';
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
    storages.app.setMap('mindsSettings', settings);

    this.settings = settings;
    // update the features based on the settings
    featuresService.updateFeatures();
  }

  /**
   * Get settings
   */
  getSettings() {
    let settings;
    if (!this.settings) {
      settings = storages.app.getMap('mindsSettings');
      if (!settings) {
        settings = this.loadDefault();
      }
      this.settings = settings;
      // update the features based on the settings
      featuresService.updateFeatures();
    }

    return this.settings;
  }

  /**
   * clear
   */
  clear() {
    this.settings = undefined;
    storages.app.removeItem('mindsSettings');
  }
}

export default new MindsConfigService();
