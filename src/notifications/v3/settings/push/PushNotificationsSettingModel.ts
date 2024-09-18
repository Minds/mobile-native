import { observable, action, computed } from 'mobx';
import { LocaleType } from '~/common/services/i18n.service';
import sp from '~/services/serviceProvider';

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
    let translation = sp.i18n.t(
      `notificationSettings.${this.notification_group}`,
    );
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
      await sp.api.post(
        `api/v3/notifications/push/settings/${this.notification_group}`,
        { enabled: this.enabled },
      );
    } catch (err) {
      this._toggleEnabled();
      sp.log.exception('[NotificationsSettingModel] toggleEnabled', err);
    }
  }

  @action _toggleEnabled() {
    this.enabled = !this.enabled;
  }
}
