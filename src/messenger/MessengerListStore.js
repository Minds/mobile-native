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
  @observable refreshing = false;
  @observable search = '';

  offset    = '';
  newsearch = true;
  loaded    = false;

  /**
   * Load conversations list
   */
  loadList() {
    const rows = 24;
    let fetching;

    // is a search?
    if (this.search && this.newsearch) {
      this.newsearch = false;
      fetching = messengerService.searchConversations(this.search, rows);
    } else {
      if (this.loaded && !this.offset) {
        return;
      }
      fetching = messengerService.getConversations(rows, this.offset, this.newsearch);
    }

    return fetching.then(response => {
        this.loaded = true;
        this.offset = response.offset;
        this.pushConversations(response.entities);
      }).catch(err => {
        console.log('error');
      });
  }

  @action
  setSearch(search) {
    this.search        = search;
    this.newsearch     = true;
    this.loaded        = false;
    this.conversations = [];
    this.offset        = '';

    this.loadList();
  }

  @action
  setRefreshing(val) {
    this.refreshing = val;
  }

  @action
  pushConversations(conversations) {
    this.conversations = [... this.conversations, ...conversations];
  }

  @action
  refresh() {
    this.refreshing    = true;
    this.loaded        = false;
    this.conversations = [];
    this.offset        = '';

    if (this.search) this.newsearch = true;

    this.loadList()
      .finally(action(() => {
        this.refreshing = false;
      }));
  }
}

export default new MessengerListStore();