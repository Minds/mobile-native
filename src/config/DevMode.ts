import { showNotification } from 'AppMessages';
import { action, observable } from 'mobx';
import { storages } from '~/common/services/storage/storages.service';

/**
 * Dev mode store
 */
export class DevMode {
  @observable isActive = false;

  /**
   * @param force force to be active
   */
  constructor(force?: boolean) {
    const active = storages.app.getBool('developer_mode') || __DEV__;
    this.isActive =
      active !== null && active !== undefined ? active : force || false;
  }

  @action
  setDevMode(value: boolean) {
    this.isActive = value;
    storages.app.setBool('developer_mode', value);
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
      storages.app.setString('developer_api_url', value);
      showNotification('Saved, please restart', 'success', 3000);
      return true;
    } catch (_) {
      console.log(_);
      showNotification('Invalid URL', 'danger', 3000);
      return false;
    }
  }

  getApiURL(): string {
    return storages.app.getString('developer_api_url') || '';
  }
}
