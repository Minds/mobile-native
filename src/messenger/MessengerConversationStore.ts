//@ts-nocheck
import { observable, action } from 'mobx';

import messengerService from './MessengerService';
import crypto from './../common/services/crypto.service';
import socket from '../common/services/socket.service';
import session from '../common/services/session.service';
import logService from '../common/services/log.service';
import MessageModel from './conversation/MessageModel';

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
  @observable invited = false;
  @observable errorLoading = false;

  @observable offset = '';
  socketRoomName = null;
  participants = null;
  invitable = null;
  @observable guid = null;

  /**
   * Initial load
   * @param {bool} refresh
   */
  async load(refresh = false) {
    if (!refresh && (this.loading || !this.moreData)) return;
    this.setLoading(true);
    this.setErrorLoading(false);

    try {
      const conversation = await messengerService.getConversationFromRemote(
        12,
        this.guid,
        this.offset,
      );

      // offset to scroll
      this.offset = conversation['load-previous'];
      // invitable
      this.invitable = conversation.invitable || null;
      // set public keys for encryption
      crypto.setPublicKeys(conversation.publickeys);

      // remove repeated message
      if (this.messages.length) conversation.messages.pop();

      if (!this.offset || !conversation.messages.length) {
        this.moreData = false;
      }

      this.assignRowKeys(conversation);
      this.setMessages(conversation.messages.reverse());
      this.checkListen(conversation);
      return conversation;
    } catch (err) {
      logService.exception(err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
  }

  @action
  setLoading(value) {
    this.loading = value;
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

  @action
  setGuid(guid) {
    this.guid = guid;
  }

  @action
  setMessages(msgs) {
    msgs.forEach((m) => this.messages.push(MessageModel.create(m)));
  }

  @action
  addMessage(msg) {
    this.messages.unshift(MessageModel.checkOrCreate(msg));
  }

  /**
   * Send a message
   * @param {string} guid conversation guid
   * @param {string} myGuid user guid
   * @param {string} text
   */
  @action
  async send(myGuid, text) {
    const message = MessageModel.create({
      guid: myGuid + this.messages.length,
      rowKey: Date.now().toString(),
      message: text,
      decryptedMessage: text,
      sending: true,
      owner: { guid: myGuid },
      time_created: Date.now() / 1000,
    });

    this.messages.unshift(message);

    try {
      const encrypted = await this._encryptMessage(text);
      const response = await messengerService.send(this.guid, encrypted);
      message.setSending(false);
      message.assign(response.message);
    } catch (err) {
      console.log(err);
    }
  }

  @action
  invite() {
    if (!this.invitable || !this.invitable.length) {
      return;
    }

    this.invited = true;
    this.invitable.forEach((participant) => {
      messengerService.invite(participant.guid);
    });
  }

  /**
   * Encript the message ussing public keys
   * @param {string} message
   */
  _encryptMessage(message) {
    const encrypted = {};
    const publickeys = crypto.getPublicKeys();

    if (!Object.keys(publickeys).length)
      return Promise.reject('No public keys to encrypt');

    return new Promise((resolve, reject) => {
      for (let guid in publickeys) {
        crypto.encrypt(message, guid).then((success) => {
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
    this.socketRoomName = null;
    this.participants = null;
    this.guid = null;
    this.invitable = null;
    this.moreData = true;
    this.invited = false;
    this.messages = [];
    this.offset = '';
    this.loading = false;
    if (this.lastMessageGuid) {
      // on leave set all messages as readed
      messengerService.getConversationFromRemote(
        1,
        this.guid,
        this.lastMessageGuid,
      );
      this.lastMessageGuid = null;
    }
  }

  reset() {
    this.clear();
  }

  /**
   * Socket pushConversationMessage
   */
  pushConversationMessage = async (guid, message) => {
    if (guid !== this.guid) {
      return;
    }

    const fromSelf = session.guid === message.ownerObj.guid;

    if (!fromSelf) {
      if (!message.message) {
        message.message =
          message.messages[session.guid > message.ownerObj.guid ? 1 : 0];
        message.rowKey = message.guid;
      }

      this.addMessage(message);
      this.lastMessageGuid = message.guid;
      // @todo: play sound and notify user
    }
  };

  @action
  clearConversation = (guid, actor) => {
    this.messages = [];
  };

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

export default MessengerConversationStore;
