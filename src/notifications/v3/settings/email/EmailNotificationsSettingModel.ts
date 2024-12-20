import { action, computed, observable } from 'mobx';
import type { LocaleType } from '~/common/services/i18n.service';
import { TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

export type EmailNotificationsSettingType = {
  campaign: 'global' | 'when' | 'with';
  guid: string;
  topic: NotificationGroupType;
  user_guid: string;
  value: string;
};

type NotificationGroupType = keyof LocaleType['notificationSettings'];

export default class EmailNotificationsSettingModel {
  campaign: 'global' | 'when' | 'with';
  guid: string;
  _topic: NotificationGroupType;
  user_guid: string;
  @observable value: string;
  oldValue = '';

  constructor(setting: EmailNotificationsSettingType) {
    this.campaign = setting.campaign;
    this.guid = setting.guid;
    this._topic = setting.topic;
    this.user_guid = setting.user_guid;
    this.value = setting.value;
  }

  @computed
  get topic() {
    let translation = sp.i18n.t(`notificationSettings.${this._topic}`, {
      TENANT,
    });
    if (
      translation.includes('missing') &&
      translation.includes('translation')
    ) {
      return this._topic;
    }
    return translation;
  }

  toggleValue(value: string) {
    this.oldValue = this.value;
    this._toggleValue(value);
    this.setValue();
  }

  async setValue() {
    try {
      let notifications = {
        [this.campaign]: {
          [this._topic]: this.value,
        },
      };
      await sp.api.post('api/v2/settings/emails', {
        notifications,
      });
    } catch (err) {
      this._toggleValue(this.oldValue);

      sp.log.exception('[NotificationsSettingModel] toggleEnabled', err);
    }
  }

  @action _toggleValue(value: string) {
    this.value = value;
  }
}
