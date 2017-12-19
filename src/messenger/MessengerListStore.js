import {
  observable,
  action
} from 'mobx';

import {
  Alert
} from 'react-native';

import messengerService from './MessengerService';
import session from './../common/services/session.service';

/**
 * Messenger Conversation List Store
 */
class MessengerListStore {
  @observable.shallow conversations = [];
  @observable refreshing = false;
  /**
   * Search string
   */
  @observable search = '';

  /**
   * key configured?
   */
  @observable configured = false;
  @observable unlocking  = false;

  offset    = '';
  newsearch = true;
  loaded    = false;
  privateKey   = null;

  constructor() {
    session.getPrivateKey()
      .then((privateKey) => {
        if (privateKey) {
          this.configured = true;
          this.privateKey = privateKey;
        }
      })
  }

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

  /**
   * Get crypto keys and unlock
   * @param {string} password
   */
  getCrytoKeys(password) {
    this.setUnlocking(true);
    messengerService.getCrytoKeys(password)
      .then(privateKey => {
        if (privateKey) {
          session.setPrivateKey(privateKey);
          this.setPrivateKey(privateKey);
        }
      })
      .finally(() => {
        this.setUnlocking(false);
      })
      .catch(() => {
        Alert.alert(
          'Sorry!',
          'Please check your credentials',
          [
            { text: 'Try again'},
          ],
          { cancelable: false }
        )
      });
  }

  @action
  setUnlocking(val) {
    this.unlocking = val;
  }

  @action
  setPrivateKey(privateKey) {
    this.privateKey = privateKey;
    this.configured = true;
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