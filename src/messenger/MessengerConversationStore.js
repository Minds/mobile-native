import {
  observable,
  action,
  inject
} from 'mobx';

import {
  Alert
} from 'react-native';

import messengerService from './MessengerService';
import crypto from './../common/services/crypto.service';
import socket from '../common/services/socket.service';
import session from '../common/services/session.service';

/**
 * Messenger Conversation Store
 */
class MessengerConversationStore {
  /**
   * Messages observable
   */
  @observable.shallow messages = [];
  @observable loading = false;
  @observable moreData = true;
  
  offset = ''
  socketRoomName = null;
  participants = null;
  guid = null;

  /**
   * Initial load
   * @param {string} offset
   */
  async load() {
    if (this.loading || !this.moreData) return;
    this.loading = true;
    
    try {
      const conversation = await messengerService.getConversationFromRemote(12, this.guid, this.offset)
    
      this.offset = conversation['load-previous'];
      if (!this.offset || !conversation.messages.length) {
        this.moreData = false;
      }

      crypto.setPublicKeys( conversation.publickeys );

      if (this.messages.length)
        conversation.messages.pop();

      this.assignRowKeys(conversation);
      this.setMessages(conversation.messages.reverse());
      this.checkListen(conversation);
    } catch (err) {
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load more
   * @param {string} offset 
   */
  async loadMore() {
    return await this.load();
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(conversation) {
    conversation.messages.forEach((message, index) => {
      message.rowKey = `${message.guid}:${index}:${this.messages.length}`;
    });
  }

  checkListen(conversation) {
    if (!this.socketRoomName && conversation.socketRoomName) {
      this.socketRoomName = conversation.socketRoomName;
      this.participants = conversation.participants;
      this.listen();
    }
  }

  setGuid(guid) {
    this.guid = guid;
  }

  @action
  setMessages(msgs) {
    msgs.forEach(m => this.messages.push(m));
  }

  @action
  addMessage(msg) {
    this.messages.unshift(msg);
  }

  /**
   * Send a message
   * @param {string} guid conversation guid
   * @param {string} myGuid user guid
   * @param {string} text
   */
  @action
  send(myGuid, text) {
    this.messages.unshift({
      guid: myGuid + this.messages.length,
      message: text,
      decrypted: true,
      owner: { guid: myGuid },
      time_created: Date.now() / 1000
    });

    return this._encryptMessage(text)
      .then(encrypted => {
        return messengerService.send(this.guid, encrypted)
      })
  }

  /**
   * Encript the message ussing public keys
   * @param {string} message
   */
  _encryptMessage(message) {
    const encrypted = {};
    const publickeys = crypto.getPublicKeys();

    return new Promise((resolve, reject) => {

      for (let guid in publickeys) {
        crypto.encrypt(message, guid)
          .then(success => {
            encrypted[guid] = success;
            if (Object.keys(encrypted).length == Object.keys(publickeys).length) {
              resolve(encrypted);
            }
          });
      }
    });
  }

  /**
   * Clear messages
   */
  @action
  clear() {
    // unlisten socket
    this.unlisten();
    this.socketRoomName  = null;
    this.participants    = null;
    this.guid            = null;
    this.messages        = [];
    if (this.lastMessageGuid) {
      // on leave set all messages as readed
      messengerService.getConversationFromRemote(1, this.guid, this.lastMessageGuid);
      this.lastMessageGuid = null;
    }
  }

  reset() {
    this.clear();
  }

  /**
   * Socket pushConversationMessage
   */
  pushConversationMessage = (guid, message) => {
    if (guid != this.guid) {
      return;
    }

    const fromSelf = session.guid == message.ownerObj.guid;

    if (!fromSelf) {
      const index = this.participants.findIndex((e) => { return e.guid == message.ownerObj.guid});

      message.message = message.messages[index];
      this.addMessage(message);
      this.lastMessageGuid = message.guid;
      // @todo: play sound and notify user
    }
  };

  @action
  clearConversation = (guid, actor) => {
    this.messages = [];
  }

  unlisten() {
    socket.leave(this.socketRoomName);
    socket.unsubscribe('pushConversationMessage', this.pushConversationMessage);
    socket.unsubscribe('clearConversation', this.clearConversation);
  }

  listen() {
    socket.join(this.socketRoomName);
    socket.subscribe('pushConversationMessage', this.pushConversationMessage);
    socket.subscribe('clearConversation', this.clearConversation);

    // TODO: implement block
    //socket.subscribe('block', this.block);
    //socket.subscribe('unblock', this.unblock);
  }
}

export default new MessengerConversationStore();