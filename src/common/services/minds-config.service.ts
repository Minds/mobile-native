import { observable } from 'mobx';
import delay from '../helpers/delay';
import api from './api.service';
import { storages } from './storage/storages.service';

/**
 * Minds Service
 */
export class MindsConfigService {
  @observable
  settings: any = null;
  private currentPromise: Promise<any> | null = null;

  /**
   * Update the settings from the server
   * @param retries
   * @returns
   */
  async update(retries: number = 15) {
    if (!this.currentPromise) {
      this.currentPromise = this._updateWithRetry(retries);
    }
    return this.currentPromise;
  }

  /**
   * Update the settings from the server
   */
  private async _updateWithRetry(retries: number) {
    try {
      const settings = await api.get<any>('api/v1/minds/config');
      if (settings.permissions) {
        settings.permissions = settings.permissions.reduce((acc, cur) => {
          acc[cur] = true;
          return acc;
        }, {});
      }
      storages.user?.setMap('mindsSettings', settings);
      this.settings = settings;
      this.currentPromise = null;
    } catch (error) {
      if (retries === 0) {
        this.currentPromise = null;
        throw error;
      }
      console.log('Error fetching minds config', error, 'Retrying...');
      // Wait for 1 second before retrying
      await delay(retries > 10 ? 800 : 2000);
      this.currentPromise = null;
      return this.update(retries - 1);
    }
  }

  /**
   * Check if user has permission
   * @param permission
   * @returns
   */
  hasPermission(permission: string) {
    const settings = this.getSettings();

    return settings?.permissions[permission] !== undefined
      ? Boolean(settings?.permissions[permission])
      : true; // default to true if permissions are not loaded
  }

  /**
   * Get settings
   */
  getSettings() {
    let settings;
    if (!this.settings) {
      settings = storages.user?.getMap('mindsSettings');
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
