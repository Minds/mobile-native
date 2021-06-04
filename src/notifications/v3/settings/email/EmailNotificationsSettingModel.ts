import { action, computed, observable } from 'mobx';
import apiService from '../../../../common/services/api.service';
import i18n from '../../../../common/services/i18n.service';
import logService from '../../../../common/services/log.service';

export type EmailNotificationsSettingType = {
  campaign: 'global' | 'when' | 'with';
  guid: string;
  topic: string;
  user_guid: string;
  value: string;
};

export default class EmailNotificationsSettingModel {
  campaign: 'global' | 'when' | 'with';
  guid: string;
  _topic: string;
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
    let translation = i18n.t('notificationSettings.' + this._topic);
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
      console.log('campaign', this.campaign);
      console.log('topic', this._topic);
      console.log('notifications', notifications);
      const response = await apiService.post('api/v2/settings/emails', {
        notifications,
      });
      console.log('setValue', response);
    } catch (err) {
      console.log('err', err);
      this._toggleValue(this.oldValue);
      logService.exception('[NotificationsSettingModel] toggleEnabled', err);
    }
  }

  @action _toggleValue(value: string) {
    this.value = value;
  }
}
