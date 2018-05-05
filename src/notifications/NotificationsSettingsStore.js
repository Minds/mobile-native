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
    this.settings[name].value = value;
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
      console.log(key)
      const toggle = settings.toggles[key];
      this.setSetting(key, toggle);
    });
  }

  @action
  reset() {
    this.settings = {
      'daily': { name: 'Daily Reward', value: true },
      'comment': { name: 'Comments', value: true },
      'like': { name: 'Votes', value: true },
      'tag': { name: 'Tags', value: true },
      'friends': { name: 'Subscriptions', value: true },
      'remind': { name: 'Reminds', value: true },
      'boost_request': { name: 'Peer2Peer Boosts', value: true },
      'boost_accepted': { name: 'Boost Approvals', value: true },
      'boost_rejected': { name: 'Boost Rejected', value: true },
      'boost_completed': { name: 'Fulfilled Boosts', value: true },
      'boost_revoked': { name: 'Boost Revoked', value: true },
      'boost_gift': { name: 'Boost Gift', value: true },
      'chat': { name: 'Messenger', value: true },
      'messenger_invite': { name: 'Messenger Invites', value: true },
      'group_invite': { name: 'Group Invites', value: true }
    };
  }

}

export default new NotificationsSettingsStore();