import {
  observable,
  action,
  computed
} from 'mobx';

import {
  Alert
} from 'react-native';

import messengerService from './MessengerService';
import session from './../common/services/session.service';
import crypto from './../common/services/crypto.service';
import socket from '../common/services/socket.service';
import badge from '../common/services/badge.service';

/**
 * Messenger Conversation List Store
 */
class MessengerListStore {

  @observable conversations = [];
  @observable refreshing = false;
  @observable loading    = false;

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
  @observable loaded     = false;

  controller = null;

  @computed get unread() {
    const count = this.conversations.filter(conv => conv.unread).length;
    badge.setUnreadConversations(count);
    return count;
  }

  constructor() {
    session.sessionStorage.getPrivateKey()
      .then((privateKey) => {
        if (privateKey) {
          this.setPrivateKey(privateKey);
        }
      });
  }

  @action
  async logout() {
    session.clearMessengerKeys();
    this.configured = false;
  }

  @action
  touchConversation = (guid) => {
    // search conversation
    const index = this.conversations.findIndex((conv) => {
      return conv.guid == guid;
    })

    if (index !== -1) {
      const conv = this.conversations[index];
      conv.unread = true;
      // put it on top
      this.conversations.remove(conv);
      this.conversations.unshift(conv);
    } else {
      this.loadList(true);
    }
  };

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
  async loadList(reload=false) {
  
    const rows = 24;
    
    // abort if we have a previous call
    if (this.controller) {
      this.controller.abort();
    }
    // abortable call controller
    this.controller = new AbortController();
    
    this.setLoading(true);

    try {
      // is a search?
      if (this.search && this.newsearch) {
        this.newsearch = false;
        response = await messengerService.searchConversations(this.search, rows, this.controller.signal);
      } else {
        
        if (this.loaded && !this.offset && !reload) {
          this.setLoading(false);
          return;
        }
        if (reload) this.offset = '';
        response = await messengerService.getConversations(rows, this.offset, this.newsearch, this.controller.signal);
      }
      if (reload) this.clearConversations();
      this.loaded = true;
      this.offset = response.offset;
      this.pushConversations(response.entities);
      this.setLoading(false);
      this.setRefreshing(false);
    } catch (err) {
      if (err.name != 'AbortError') {
        console.log('error', err);
        this.setLoading(false);
        this.setRefreshing(false);
      }
    }
  }

  /**
   * Get crypto keys and unlock
   * @param {string} password
   */
  async getCrytoKeys(password) {
    this.setUnlocking(true);
    return messengerService.getCrytoKeys(password)
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

  /**
   * Setup messenger
   * @param {string} password 
   */
  async doSetup(password) {
    this.setUnlocking(true);
    return messengerService.doSetup(password)
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
          'Error creating the encryptions keys',
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
  setLoading(val) {
    this.loading = val;
  }

  @action
  setPrivateKey(privateKey) {
    crypto.setPrivateKey(privateKey);
    this.configured = true;
  }

  @action
  setSearch(search) {
    this.search        = search;
    this.newsearch     = search != '';
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
    if (this.loading) return;

    this.refreshing    = true;
    this.loaded        = false;
    this.conversations = [];
    this.offset        = '';

    if (this.search) this.newsearch = true;

    this.loadList()
      .finally(() => {
        this.setRefreshing(false);
      });
  }

  @action
  reset() {
    this.conversations = [];
    this.refreshing = false;
    this.search = '';
    this.configured = false;
    this.unlocking = false;
    this.offset = '';
    this.newsearch = true;
    this.loaded = false;
    this.loading = false;
  }

}

export default new MessengerListStore();