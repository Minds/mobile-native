import { observable, action, computed } from 'mobx';
import apiService from '../../../../common/services/api.service';
import i18n, { LocaleType } from '../../../../common/services/i18n.service';
import logService from '../../../../common/services/log.service';

type NotificationGroupType = keyof LocaleType['notificationSettings'];

export default class PushNotificationsSettingModel {
  @observable enabled: boolean;
  public notification_group: NotificationGroupType;

  constructor(setting: {
    enabled: boolean;
    notification_group: NotificationGroupType;
  }) {
    this.notification_group = setting.notification_group;
    this.enabled = setting.enabled;
  }

  @computed
  get notificationGroup() {
    let translation = i18n.t(`notificationSettings.${this.notification_group}`);
    if (
      translation.includes('missing') &&
      translation.includes('translation')
    ) {
      return this.notification_group;
    }
    return translation;
  }

  toggleEnabled = () => {
    this._toggleEnabled();
    this.toggle();
  };

  async toggle() {
    try {
      await apiService.post(
        `api/v3/notifications/push/settings/${this.notification_group}`,
        { enabled: this.enabled },
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
