import {
  observable,
  action
} from 'mobx'

/**
 * Notifications Settings Store
 */
class NotificationsSettingsStore {
  @observable settings = [
    { id: 'daily', name: 'Daily Reward', value:true },
    { id: 'comment', name: 'Comments', value:true },
    { id: 'like', name: 'Votes', value:true },
    { id: 'tag', name: 'Tags', value:true },
    { id: 'friends', name: 'Subscriptions', value:true },
    { id: 'reminds', name: 'Reminds', value:true },
    { id: 'boost_request', name: 'Peer2Peer boosts', value:true },
    { id: 'boost_accepted', name: 'Boost approvals', value:true },
    { id: 'boost_completed', name: 'Fulfilled boosts', value:true },
    { id: 'chat', name: 'Messenger', value:true },
    { id: 'group_invite', name: 'Group Invites', value:true }
  ];

  @action
  setSetting(name, value) {
    const setting = this.settings.find((row) => {
      return row.id == name;
    });
    setting.value = value;
  }

  @action
  reset() {
    this.settings = [
      { id: 'daily', name: 'Daily Reward', value:true },
      { id: 'comment', name: 'Comments', value:true },
      { id: 'like', name: 'Votes', value:true },
      { id: 'tag', name: 'Tags', value:true },
      { id: 'friends', name: 'Subscriptions', value:true },
      { id: 'reminds', name: 'Reminds', value:true },
      { id: 'boost_request', name: 'Peer2Peer boosts', value:true },
      { id: 'boost_accepted', name: 'Boost approvals', value:true },
      { id: 'boost_completed', name: 'Fulfilled boosts', value:true },
      { id: 'chat', name: 'Messenger', value:true },
      { id: 'group_invite', name: 'Group Invites', value:true }
    ];
  }

}

export default new NotificationsSettingsStore();