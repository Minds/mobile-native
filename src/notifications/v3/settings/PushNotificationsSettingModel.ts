import { observable, action, computed } from 'mobx';
import apiService from '../../../common/services/api.service';
import i18n from '../../../common/services/i18n.service';
import logService from '../../../common/services/log.service';

export default class PushNotificationsSettingModel {
  @observable enabled: boolean;
  public notification_group: string;

  constructor(setting: { enabled: boolean; notification_group: string }) {
    this.notification_group = setting.notification_group;
    this.enabled = setting.enabled;
  }

  @computed
  get notificationGroup() {
    let translation = i18n.t('notificationSettings.' + this.notification_group);
    if (
      translation.includes('missing') &&
      translation.includes('translation')
    ) {
      return this.notification_group;
    }
    return translation;
  }

  toggleEnabled() {
    this._toggleEnabled();
    this.toggle();
  }

  async toggle() {
    try {
      await apiService.post(
        `api/v3/notifications/push/settings/${this.notification_group}`,
        {},
      );
    } catch (err) {
      this._toggleEnabled();
      logService.exception('[NotificationsSettingModel] toggleEnabled', err);
    }
  }

  @action _toggleEnabled() {
    this.enabled = !this.enabled;
  }
}
