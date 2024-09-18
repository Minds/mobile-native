import { showNotification } from 'AppMessages';
import { action, observable } from 'mobx';
import type { Storages } from '~/common/services/storage/storages.service';

/**
 * Dev mode store
 */
export class DevModeService {
  @observable isActive = false;

  /**
   * @param force force to be active
   */
  constructor(private storagesService: Storages, force?: boolean) {
    const active = storagesService.app.getBoolean('developer_mode') || __DEV__;
    this.isActive =
      active !== null && active !== undefined ? active : force || false;
  }

  @action
  setDevMode(value: boolean) {
    this.isActive = value;
    this.storagesService.app.set('developer_mode', value);
    showNotification(
      value ? 'Developer Mode Enabled' : 'Developer Mode Disabled',
      'success',
    );
  }

  setApiURL(value: string): boolean {
    try {
      value = value.trim();
      if (value !== '') {
        new URL(value);
        if (!value.startsWith('http:') && !value.startsWith('https:')) {
          throw new Error('Invalid URL');
        }
        if (!value.endsWith('/')) {
          value += '/';
        }
      }
      this.storagesService.app.set('developer_api_url', value);
      showNotification('Saved, please restart', 'success', 3000);
      return true;
    } catch (_) {
      console.log(_);
      showNotification('Invalid URL', 'danger', 3000);
      return false;
    }
  }

  getApiURL(): string {
    return this.storagesService.app.getString('developer_api_url') || '';
  }

  getStaging() {
    return this.storagesService.app.getBoolean('staging') || false;
  }

  getCanary() {
    return this.storagesService.app.getBoolean('canary') || false;
  }
}
