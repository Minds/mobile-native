import { observable } from 'mobx';
import delay from '../helpers/delay';
import type { ApiService } from './api.service';
import type { Storages } from './storage/storages.service';
import { isTokenExpired } from './TokenExpiredError';
import { PermissionIntentTypeEnum, PermissionsEnum } from '~/graphql/api';

export type PermissionIntent = {
  intent_type: PermissionIntentTypeEnum;
  membership_guid?: string;
  permission_id: PermissionsEnum;
};

/**
 * Minds Service
 */
export class MindsConfigService {
  @observable
  settings: any = null;
  private currentPromise: Promise<any> | null = null;

  constructor(private api: ApiService, private storages: Storages) {}

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
    let settings;
    const sessionService = require('./session.service');
    try {
      settings = await this.api.get<any>('api/v1/minds/config');

      // check if user session is still valid
      if (settings?.LoggedIn === false && sessionService.userLoggedIn) {
        // call the endpoint to trigger a token refresh
        const user = await this.api.get<{ guid: string }>('api/v1/channel/me');
        // if succeeds the token was refreshed, fetch config again
        if (user?.guid) {
          settings = await this.api.get<any>('api/v1/minds/config');
        }
      }

      if (settings.permissions && settings?.LoggedIn) {
        settings.permissions = settings.permissions.reduce((acc, cur) => {
          acc[cur] = true;
          return acc;
        }, {});
      } else {
        settings.permissions = undefined;
      }

      if (settings.permission_intents) {
        settings.permission_intents = settings.permission_intents.reduce(
          (acc, cur) => {
            acc[cur.permission_id] = cur;
            return acc;
          },
          {},
        );
      } else {
        settings.permission_intents = undefined;
      }

      // nsfw enabled by default
      settings.nsfw_enabled = settings.nsfw_enabled ?? true;

      this.storages.user?.setObject('mindsSettings', settings);
      this.settings = settings;
      this.currentPromise = null;
    } catch (error: any) {
      if (
        retries === 0 ||
        isTokenExpired(error) ||
        error?.response?.status === 401
      ) {
        this.currentPromise = null;
        throw error;
      }
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
  hasPermission(permission: PermissionsEnum) {
    const settings = this.getSettings();

    return settings?.permissions !== undefined
      ? Boolean(settings.permissions[permission])
      : true; // default to true if permissions are not loaded
  }

  getPermissionIntent(
    permission: PermissionsEnum,
  ): PermissionIntent | undefined {
    const settings = this.getSettings();

    return settings?.permission_intents !== undefined
      ? settings.permission_intents[permission]
      : undefined;
  }

  /**
   * Get settings
   */
  getSettings() {
    let settings;
    if (!this.settings) {
      settings = this.storages.user?.getObject('mindsSettings');
      this.settings = settings;
    }
    return this.settings;
  }

  /**
   * clear
   */
  clear() {
    this.settings = undefined;
    this.storages.user?.delete('mindsSettings');
  }
}
