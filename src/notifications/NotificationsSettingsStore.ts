import {
  observable,
  action
} from 'mobx';

import { getSettings, setSetting } from './NotificationsService';

/**
 * Notifications Settings Store
 */
class NotificationsSettingsStore {
  @observable settings = {}

  constructor() {
    this.reset();
  }

  @action
  setSetting(name, value) {
    // in case is not defined
    this.settings[name] = value;
  }

  async saveSetting(name, value) {
    try {
      this.setSetting(name, value);
      const result = setSetting(name, value);
      return true;
    } catch(err) {
      this.setSetting(name, !value);
      console.error(err);
      alert('Error saving setting');
      return false;
    }
  }

  @action
  async load() {
    const settings = await getSettings();

    Object.keys(settings.toggles).forEach(key => {
      const toggle = settings.toggles[key];
      this.setSetting(key, toggle);
    });
  }

  @action
  reset() {
    this.settings = {
      'comment': true,
      'like': true,
      'tag': true,
      'friends': true,
      'remind': true,
      'boost_request': true,
      'boost_rejected': true,
      'boost_completed': true,
      'rewards_reminder': true,
      'rewards_summary': true,
      'messenger_invite': true,
      'message': true,
      'group_invite': true,
      'daily': true,
      'boost_gift': true,
      'boost_accepted': true,
      'boost_revoked': true,
    };
  }

}

export default NotificationsSettingsStore;
