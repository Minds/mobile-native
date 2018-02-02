import {
  observable,
  action
} from 'mobx';

import {
  Alert
} from 'react-native';

import messengerService from './MessengerService';
import session from './../common/services/session.service';
import crypto from './../common/services/crypto.service';
import socket from '../common/services/socket.service';

/**
 * Messenger Conversation List Store
 */
class MessengerListStore {
  @observable conversations = [];
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

  offset     = '';
  newsearch  = true;
  loaded     = false;

  constructor() {
    session.sessionStorage.getPrivateKey()
      .then((privateKey) => {
        if (privateKey) {
          this.setPrivateKey(privateKey);
        }
      });

  }

  @action
  touchConversation = action((guid) => {
    // search conversation
    const index = this.conversations.findIndex((conv) => {
      return conv.guid == guid;
    })

    if (index !== -1) {
      this.conversations[index].unread = true;
    }
  });

  /**
   * Start listen socket
   */
  listen() {
    socket.subscribe('touchConversation', this.touchConversation);
  }

  /**
   * Stop listen socket
   */
  unlisten() {
    socket.unsubscribe('touchConversation', this.touchConversation);
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
          session.sessionStorage.setPrivateKey(privateKey);
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
    crypto.setPrivateKey(privateKey);
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
  clearConversations() {
    this.conversations = [];
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