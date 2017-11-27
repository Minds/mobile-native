import {
  observable,
  action
} from 'mobx';

import messengerService from './MessengerService';

/**
 * Messenger Conversation List Store
 */
class MessengerListStore {
  @observable conversations = [];
  @observable refreshing    = false;

  offset = '';
  loading = false;

  /**
   * Load conversations list
   * @param {boolean} refresh
   */
  loadList(refresh = false) {

    if (this.loading) return;
    // is loading
    this.loading = true;
    this.setRefreshing(true);
    // is a refresh?
    if (refresh) {
      this.offset = '';
      this.conversations = [];
    }
    messengerService.getCoonversations(12, this.offset)
      .then(response => {
        this.offset = response['load-next'];
        this.pushConversations(response.conversations);
      }).finally(() => {
        this.loading = false;
        if (this.refreshing === true) {
          setTimeout(() => {
            this.setRefreshing(false);
          }, 500);
        }
      }).catch(err =>{
        console.log('error', err);
      });
  }

  @action
  setRefreshing(val) {
    this.refreshing = val;
  }

  @action
  pushConversations(conversations) {
    this.conversations = [... this.conversations, ...conversations];
  }
}

export default new MessengerListStore();