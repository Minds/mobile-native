import {
  observable,
  action,
  inject
} from 'mobx';

import {
  Alert
} from 'react-native';

import messengerService from './MessengerService';
import session from './../common/services/session.service';
import crypto from './../common/services/crypto.service';

/**
 * Messenger Conversation Store
 */
class MessengerConversationStore {
  /**
   * Messages observable
   */
  @observable.shallow messages = [];

  /**
   * Load conversation from remote
   * @param {string} guid
   * @param {string} offset
   */
  load(guid, offset = '') {
    return messengerService.getConversationFromRemote(15, guid, offset)
      .then(conversation => {
        crypto.setPublicKeys( conversation.publickeys );
        this.messages = conversation.messages.reverse();
      })
  }

  /**
   * Send a message
   * @param {string} guid conversation guid
   * @param {string} myGuid user guid
   * @param {string} text
   */
  @action
  send(guid, myGuid, text) {
    this.messages.unshift({
      guid: myGuid + this.messages.length,
      message: text,
      decrypted: true,
      owner: { guid: myGuid },
      time_created: Date.now() / 1000
    });

    return this._encryptMessage(text)
      .then(encrypted => {
        return messengerService.send(guid, encrypted)
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
    this.messages = [];
  }

}

export default new MessengerConversationStore();