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
  @observable search = ''

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
    messengerService.getConversations(12, this.offset)
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

  /**
   * Search conversations list
   * @param {string} q
   */
  searchList(q) {
    if (!q) {
      return this.loadList(true);
    }

    this.loading = true;
    this.setRefreshing(true);

    messengerService.searchConversations(q, 12, '')
      .then((response) => {
        this.conversations = [];
        this.pushConversations(response.conversations);
        this.offset = response['load-next'];
      })
      .finally(() => {
        this.loading = false;
        if (this.refreshing === true) {
          setTimeout(() => {
            this.setRefreshing(false);
          }, 500);
        }
      })
      .catch(err => {
        console.log('error', err);
      })
  }

  @action
  setSearch(search) {
    this.search = search;
    this.searchList(search);
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