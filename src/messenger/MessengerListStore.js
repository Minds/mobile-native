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
import { abort } from '../common/helpers/abortableFetch';

/**
 * Messenger Conversation List Store
 */
class MessengerListStore {

  /**
   * @var {array} conversations
   */
  @observable conversations = [];

  /**
   * @var {bool} refreshing
   */
  @observable refreshing = false;

  /**
   * @var {bool} loading
   */
  @observable loading = false;

  /**
   * @var {bool} errorLoading
   */
  @observable errorLoading = false;

  /**
   * @var {bool} loaded
   */
  @observable loaded = false;

  /**
   * @var {string} search
   */
  @observable search = '';

  /**
   * @var {bool} configured
   */
  @observable configured = false;

  /**
   * @var {bool} unlocking
   */
  @observable unlocking = false;

  offset     = '';
  newsearch  = true;

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
  async loadList(reload = false) {

    const rows = 24;

    // abort if we have a previous call
    abort(this);

    this.setLoading(true);
    this.setErrorLoading(false);

    let response;

    try {
      // is a search?
      if (this.search && this.newsearch) {
        this.newsearch = false;
        response = await messengerService.searchConversations(this.search, rows, this);
      } else {

        if (this.loaded && !this.offset && !reload) {
          return;
        }
        if (reload) this.offset = '';
        response = await messengerService.getConversations(rows, this.offset, this.newsearch, this);
      }
      if (reload) this.clearConversations();
      this.offset = response.offset;
      this.pushConversations(response.entities);
      this.setLoaded(true);
      this.setRefreshing(false);
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      this.setErrorLoading(true);
      console.log(err);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get crypto keys and unlock
   * @param {string} password
   */
  getCryptoKeys(password) {
    this.setUnlocking(true);
    return messengerService.getCryptoKeys(password)
      .then(privateKey => {
        if (privateKey) {
          session.sessionStorage.setPrivateKey(privateKey);
          this.setPrivateKey(privateKey);
        }
        return privateKey;
      })
      .catch((e) => {
        Alert.alert(
          'Sorry!',
          'Please check your credentials',
          [
            { text: 'Try again'},
          ],
          { cancelable: false }
        )
      })
      .finally(() => {
        this.setUnlocking(false);
      });
  }

  /**
   * Setup messenger
   * @param {string} password
   */
  async doSetup(password) {
    this.setUnlocking(true);
    try {
      const success = await messengerService.doSetup(password);
      return await this.getCryptoKeys(password);
    } catch (error) {
      Alert.alert(
        'Sorry!',
        'Error creating the encryptions keys',
        [
          { text: 'Try again'},
        ],
        { cancelable: false }
      )
    } finally {
      this.setUnlocking(false);
    }
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
  }

  @action
  setUnlocking(value) {
    this.unlocking = value;
  }

  @action
  setLoading(value) {
    this.loading = value;
  }

  @action
  setLoaded(value) {
    this.loaded = value;
  }

  @action
  setPrivateKey(privateKey) {
    console.log('SET PRIVATE')
    this.configured = true;
    crypto.setPrivateKey(privateKey);
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
    this.errorLoading = false;
  }

}

export default MessengerListStore;